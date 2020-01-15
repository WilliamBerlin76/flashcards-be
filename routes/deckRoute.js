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
router.post('/', (req, res) => {
  const { cards } = req.body;

  let batch = admin.db.batch();

  cards.forEach(card => {
    batch.set(admin.db.collection('PublicDecks').doc(card.front), {
      front: card.front,
      back: card.back
    });
  });
  batch.commit().then(response => {
    res.status(200).json({ message: 'batched' });
  });
});

module.exports = router;
