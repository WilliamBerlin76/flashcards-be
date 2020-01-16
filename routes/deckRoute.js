const router = require('express').Router();
const admin = require('../config/firestore-config');

const Deck = require('../models/deckModel');

router.get('/:id/:colId', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getDeckInfo(id, colId).then(snapshot => {
    Deck.getCards(id, colId).then(col => {
      col.forEach(doc => {
        let card = doc.data();
        deckArr.push({ id: doc.id, front: card.front, back: card.back });
      });
      snapshot.forEach(doc => {
        let deckInfo = doc.data();
        deckInformation = {
          deckName: colId,
          public: deckInfo.public,
          deckLength: deckInfo.deckLength,
          publicId: deckInfo.publicId,
          createdBy: deckInfo.createdBy,
          exampleCard: deckInfo.exampleCard
        };
      });
      res.status(200).json({ deckInformation, cards: deckArr });
    });
  });
});

// Batch example; posting multiple items at once.
router.post('/:uid/:colId', (req, res) => {
  const { cards } = req.body;
  const { uid, colId} = req.params;
  let batch = admin.db.batch();
  admin.db.collection('Users').doc(uid).collection('UserInformation').doc('Decks').get().then(deckDoc => {
    if(!deckDoc.exists){
      admin.db.collection('Users').doc(uid).collection('UserInformation').doc('Decks').set({obj: 'created'})
    }
  })
  Deck.postCards(uid, colId, cards)
  .then(response => {
    const deckInfo = {
      createdBy: uid, 
      deckLength: cards.length, 
      exampleCard: cards[0].front
    }
    admin.db.collection('Users').doc(uid).collection('UserInformation').doc('Decks').collection(colId).doc('DeckInformation').set(deckInfo)
    .then(response => {
      res.status(200).json({ message: 'batched' });
    })
  })
  .catch(err => {
    res.status(500).json({error: 'there was an error adding your cards to the deck'})
  })
});

module.exports = router;
