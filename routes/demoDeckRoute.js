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

/**
 * @swagger
 *
 * /api/demo/:id:
 *   get:
 *     description: Get all decks associated with an id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Array of Deck Names
 *       '404':
 *          description: collection not found
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                description: error message
 *
 */

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const decArr = [];
  Demo.getListOfDecks(id)
    .then(collections => {
      for (let collection of collections) {
        decArr.push({
          deckName: collection.id,
          demo: true
        });
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

/**
 * @swagger
 *
 * /api/demo/:id/:colId :
 *   get:
 *     description: Get all decks associated with an id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Collection Id
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Receive an Object with the deckname and data array containing each card as an object
 *       '404':
 *          description: collection not found
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                description: error message
 *
 */

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
