const router = require('express').Router();
const admin = require('../config/firestore-config')

//This returns the deck infor and cards for a public deck
router.get('/:deckId', (req, res)=> {
    const {deckId} = req.params;
    let deckInformation
    let deckArr = []

  admin.db.doc(`/PublicDecks/${deckId}`).get()
    .then(doc => {
      if(doc.exists){
        let collections = admin.db.collection('PublicDecks')
            .doc(deckId).listCollections()
        return collections
      } else {
        return  res.status(404).json({error: 'deck not found'})
      }
    })
    .then((collections)=>{
      const collectionId = collections[0]._queryOptions.collectionId
      return admin.db.collection('PublicDecks').doc(deckId).collection(collectionId).get()
    })
    .then(data=>{
      data.forEach(doc=>{
        let card = doc.data();
        deckArr.push({
          id: doc.id,
          data: card
        })
      })
      return res.status(200).json({deckInformation, data: deckArr})
    })
    .catch(err=>{
      console.error(err)
      return res.status(500).json({error: 'failed to get your public deck'})
    })

    
})

module.exports = router;