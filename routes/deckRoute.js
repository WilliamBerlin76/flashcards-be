const router = require('express').Router();

const Deck = require('../models/deckModel');

router.get('/:id/:colId', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getDeckInfo(id, colId).then(snapshot => {
    Deck.getCards(id, colId).then(col => {
      col.forEach(doc => {
        deckArr.push({ id: doc.id, card: doc.data() });
      });
      snapshot.forEach(doc => {
        deckInformation = { deckName: colId, deckInfo: doc.data() };
      });
      res.status(200).json({ deckInformation, data: deckArr });
    });
  });
});

module.exports = router;
