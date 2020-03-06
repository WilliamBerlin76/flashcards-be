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
        deckInformation = doc.data();
        return db.collection('PublicDecks')
            .doc(deckId)
            .collection(deckInformation.deckName)
            .get()
      } else {
          res.status(404).json({error: 'deck not found'})
      }
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
      res.status(500).json({error: 'failed to get your public deck'})
    })

    
})