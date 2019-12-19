const router = require('express').Router();

const Demo = require('../models/demoDeckModel');
const verifyDeck = require('../middleware/verifyDeckId');

router.get('/', (req, res) => {
  const deckArr = [];

  Demo.getAllDecks()
    .then(snapshot => {
      snapshot.forEach(doc => {
        deckArr.push({ id: doc.id, data: doc.data() });
      });
      res.status(200).json(deckArr);
    })
    .catch(err => {
      console.log('GET DEMO DECK ERR', err);
      res
        .status(500)
        .json({ error: 'There was an error getting the deck from the server' });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const decArr = [];
  Demo.getListOfDecks(id)
    .then(collections => {
      for (let collection of collections) {
        decArr.push(collection.id);
      }
      res.status(200).json(decArr);
    })
    .catch(err => {
      console.log('GET DEMO BY ID ERR', err);
      res.status(500).json({
        error:
          'There was an error retrieving the demodeck by Id from the database'
      });
    });
});

router.get('/:id/:colId', verifyDeck.verifyDeckId, (req, res) => {
  const { id, colId } = req.params;
  const cardArr = [];
  Demo.getDeckById(id, colId)
    .then(snapshot => {
      snapshot.forEach(doc => {
        cardArr.push({ id: doc.id, data: doc.data() });
      });
      res.status(200).json({ deckName: colId, data: cardArr });
    })
    .catch(err => {
      res.status(404).json({ error: "That deck doesn't exist" });
    });
});

module.exports = router;
