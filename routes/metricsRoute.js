const router = require('express').Router();
const admin = require('../config/firestore-config');
const Data = require('../models/metricsModel')



const dateId = new Date().setHours(12,0,0,0)

//gets that current days metrics
router.get('/:id/:days', (req, res)=>{
    const userId = req.params.id;
    const days = parseInt(req.params.days)
    let metricsArray = []
    let dates = []
    let newDate = dateId;
    for(let i = 0; i < days; i++){
        dates.push(newDate)
        newDate = newDate - (24*60*60*1000)
    }
    dates.forEach((date, index) => {
        Data.getMetrics(userId, date)
        .then(doc => {
            const metrics = doc.data();
            metricsArray.push({date, metrics})
            if (metricsArray.length === dates.length) {
                const sendMetrics =metricsArray.filter(val =>{
                    if(val.metrics){
                        return val
                    } else {
                        return null
                    }
                })
                return res.status(200).json(sendMetrics)
            } else {
                null
            }
        })
        .catch(err=>{
            console.error(err)
            res.status(500).json({message: 'failed to get your metrics'})
        })
    }) //end for loop
  
    
})

/** 
 * @swagger 
 * 
 * /api/metrics/:id/:days:
 *   get: 
 *     description: get metric date data for all dates within specified time frame
 *     produces: 
 *       - application/json
 *     parameters: 
 *       - name: id
 *         description: userId
 *         required: true
 *         type: string
 *       - name: days
 *         decription: number of days of data
 *         required: true
 *         type: string
 *     responses:
 *        '200':
 *         description: Array of objects that includes a date in milliseconds and an object of metrics data
 *        '500': 
 *         description: failed to get metrics
 *              
 * 
 *          
 * 
 * 
 * 
 * 
 * 
 */

router.post('/:id', (req, res)=>{
    const {id} = req.params;
    Data.addMetrics(id, dateId, req.body)
        .then(() => {
            res.status(201).json({message: 'add those stats'})
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({message: 'there was a problem'})
        })

})

/** 
 * @swagger 
 * 
 * /api/metrics/:id:
 *    post: 
 *       description: posts metric data to current date
 *       produces: 
 *         - application/json
 *       parameters: 
 *         - name: id
 *           description: userId
 *           required: true
 *           type: string
 *         - name: metrics
 *           description: object
 *           required: true
 *           type: object
 * 
 *       responses:
 *          '201':
 *            description: Confirmation of added stats
 *          '500': 
 *            description: failed to add stats 
 * 
 * 
 */

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    newData = req.body
    Data.getMetrics(id, dateId)
        .then(doc=>{
            let metrics = doc.data();
            console.log('metrics before', metrics)
            metrics = {
                cardsCorrect: metrics.cardsCorrect + newData.cardsCorrect,
                cardsIncorrect: metrics.cardsIncorrect + newData.cardsIncorrect,
                cardsStudied: metrics.cardsStudied + newData.cardsStudied
            }
            console.log('new Metrics', metrics)
            return metrics
        })
        .then((metrics)=>{
            Data.addMetrics(id, dateId, metrics)
            .then(() => {
                console.log('did it')
                return res.status(201).json({message: 'add those stats'})
            })
            .catch(err=>{
                console.error(err);
                return res.status(500).json({message: 'there was a problem'})
            })
        })
        .catch(err=>{
            console.error(err)
            res.status(500).json({message: 'woops, failed to update'})
        })

})
/** 
 * @swagger 
 * 
 * /api/metrics/:id:
 *   put: 
 *     description: updates metric data to current date
 *     produces: 
 *       -application/json
 *     parameters: 
 *       - name: id
 *         description: userId
 *         required: true
 *         type: string
 *       - name: metrics
 *         description: object
 *         required: true
 *         type: object
 *     responses:
 *       '201':
 *         description: Confirmation of added stats
 *       '500': 
 *         description: failed to update stats 
 * 
 * 
 */



module.exports = router