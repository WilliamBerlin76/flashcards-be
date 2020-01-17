const router = require('express').Router();
const admin = require('../config/firestore-config');

const Deck = require('../models/deckModel');

router.get('/:id/archive', (req, res) => {
  const { id } = req.params;
  const deckArr = [];
  const infoArr = [];

  Deck.getListOfArchivedDecks(id)
    .then(collections => {
      for (let collection of collections) {
        deckArr.push(collection.id);
      }

      deckArr.forEach(deck => {
        Deck.getArchivedInfo(id, deck).then(snapshot => {
          snapshot.forEach(doc => {
            let deckInfo = doc.data();
            infoArr.push(deckInfo);
          });
          if (infoArr.length == deckArr.length) {
            res.status(200).json({ decksInfo: infoArr });
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Not working' });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id/archive:
 *   get:
 *     description: Get all archived decks and their information associated with a user id
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
 *         description: Array of deck objects
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

router.get('/:id/:colId/archive', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getArchivedInfo(id, colId)
    .then(snapshot => {
      Deck.getArchivedCards(id, colId).then(col => {
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            front: card.front,
            back: card.back,
            archived: card.archived
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = {
            deckName: deckInfo.deckName,
            deckLength: deckInfo.deckLength,
            createdBy: deckInfo.createdBy,
            exampleCard: deckInfo.exampleCard
          };
        });
        res.status(200).json({ deckInformation, cards: deckArr });
      });
    })
    .catch(err => {
      res.status(404).json({ error: 'deck does not exist' });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/archive:
 *   get:
 *     description: Get all cards from a users archived deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Array of cards by deck, and deckinfo
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

router.delete('/:id/:colId/delete-archived-deck', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];

  Deck.getArchivedCards(id, colId).then(col => {
    col.forEach(doc => {
      let card = doc.data();
      deckArr.push({ id: doc.id, front: card.front, back: card.back });
    });
    Deck.deleteArchivedCards(id, colId, deckArr).then(deck => {
      Deck.deleteArchivedInfo(id, colId).then(response => {
        res.status(200).json({ message: 'Successfully deleted' });
      });
    });
  });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/delete-archived-deck:
 *   delete:
 *     description: Deletes an archived deck with all of its cards
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted message
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
  const deckArr = [];
  const infoArr = [];

  Deck.getListOfDecks(id)
    .then(collections => {
      for (let collection of collections) {
        deckArr.push(collection.id);
      }
      deckArr.forEach(deck => {
        Deck.getDeckInfo(id, deck).then(snapshot => {
          snapshot.forEach(doc => {
            let deckInfo = doc.data();
            infoArr.push(deckInfo);
          });
          if (infoArr.length == deckArr.length) {
            res.status(200).json({ decksInfo: infoArr });
          }
        });
      });
    })
    .catch(err => {
      console.log('GET DEMO BY ID ERR', err);
      res.status(500).json({
        error: 'There was an error retrieving the decks form the db by user'
      });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id:
 *   get:
 *     description: Get all decks and their information associated with a user id
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
 *         description: Array of deck objects
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

router.get('/:id/:colId', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getDeckInfo(id, colId)
    .then(snapshot => {
      Deck.getCards(id, colId).then(col => {
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            front: card.front,
            back: card.back,
            archived: card.archived
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = {
            deckName: deckInfo.deckName,
            deckLength: deckInfo.deckLength,
            createdBy: deckInfo.createdBy,
            exampleCard: deckInfo.exampleCard
          };
        });
        res.status(200).json({ deckInformation, cards: deckArr });
      });
    })
    .catch(err => {
      res.status(404).json({ error: 'deck does not exist' });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId:
 *   get:
 *     description: Get all cards from a users deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Array of cards by deck, and deckinfo
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

router.post('/:id/:colId', (req, res) => {
  const { cards } = req.body;
  const { id, colId } = req.params;
  let deckArr = [];
  let batch = admin.db.batch();
  admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .get()
    .then(deckDoc => {
      if (!deckDoc.exists) {
        admin.db
          .collection('Users')
          .doc(id)
          .collection('UserInformation')
          .doc('Decks')
          .set({ obj: 'created' });
      }
    });
  Deck.postCards(id, colId, cards)
    .then(response => {
      const deckInfo = {
        createdBy: id,
        collectionId: colId,
        deckName: colId,
        deckLength: cards.length,
        exampleCard: cards[0].front
      };
      admin.db
        .collection('Users')
        .doc(id)
        .collection('UserInformation')
        .doc('Decks')
        .collection(colId)
        .doc('DeckInformation')
        .set(deckInfo)
        .then(response => {
          Deck.getDeckInfo(id, colId).then(snapshot => {
            Deck.getCards(id, colId).then(col => {
              col.forEach(doc => {
                let card = doc.data();
                deckArr.push({
                  id: doc.id,
                  front: card.front,
                  back: card.back,
                  archived: card.archived
                });
              });
              snapshot.forEach(doc => {
                let deckInfo = doc.data();
                deckInformation = {
                  deckName: colId,
                  deckLength: deckInfo.deckLength,
                  createdBy: deckInfo.createdBy,
                  exampleCard: deckInfo.exampleCard
                };
              });
              res.status(200).json({ deckInformation, cards: deckArr });
            });
          });
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'there was an error adding your cards to the deck' });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId:
 *   post:
 *     description: creates deck and cards for a new deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *       - name: cards
 *         description: array of cards
 *         in: body
 *         required: true
 *         type: array
 *     responses:
 *       '201':
 *         description: Array of cards by deck and deckInfo
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

router.post('/:id/:colId/add', (req, res) => {
  const { cards } = req.body;
  const { id, colId } = req.params;
  const deckArr = [];
  let deckInformation;
  Deck.postCards(id, colId, cards).then(response => {
    Deck.getDeckInfo(id, colId).then(snapshot => {
      Deck.getCards(id, colId).then(col => {
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            front: card.front,
            back: card.back,
            archived: card.archived
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = {
            deckName: colId,
            deckLength: deckArr.length,
            createdBy: deckInfo.createdBy,
            exampleCard: deckInfo.exampleCard
          };
        });
        admin.db
          .collection('Users')
          .doc(id)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .update({ deckLength: deckArr.length });
        res.status(201).json({ deckInformation, cards: deckArr });
      });
    });
  });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/add:
 *   post:
 *     description: Add cards to an existing deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *       - name: cards
 *         description: array of cards
 *         in: body
 *         required: true
 *         type: array
 *     responses:
 *       '201':
 *         description: Array of cards by deck and deckInfo
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

router.delete('/:id/:colId/delete-cards', (req, res) => {
  const { id, colId } = req.params;
  const { cards } = req.body;

  let deckInformation;
  let deckArr = [];

  Deck.deleteCards(id, colId, cards).then(snapshot => {
    Deck.getDeckInfo(id, colId).then(snapshot => {
      Deck.getCards(id, colId).then(col => {
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            front: card.front,
            back: card.back,
            archived: card.archived
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = {
            deckName: colId,
            deckLength: deckArr.length,
            createdBy: deckInfo.createdBy,
            exampleCard: deckArr[0].front
          };
        });
        admin.db
          .collection('Users')
          .doc(id)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .update({
            deckLength: deckArr.length,
            exampleCard: deckArr[0].front
          });
        res.status(200).json({ deckInformation, cards: deckArr });
      });
    });
  });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/delete-cards:
 *   delete:
 *     description: Removes cards from an existing deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *       - name: cards
 *         description: array of cards
 *         in: body
 *         required: true
 *         type: array
 *     responses:
 *       '200':
 *         description: Array of cards by deck and deckInfo
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

router.delete('/:id/:colId/delete-deck', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];

  Deck.getCards(id, colId).then(col => {
    col.forEach(doc => {
      let card = doc.data();
      deckArr.push({ id: doc.id, front: card.front, back: card.back });
    });
    Deck.deleteCards(id, colId, deckArr).then(deck => {
      Deck.deleteDeckInfo(id, colId).then(response => {
        res.status(200).json({ message: 'Successfully deleted' });
      });
    });
  });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/delete-deck:
 *   delete:
 *     description: Deletes a deck with all of its cards
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted message
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

router.put('/update-deck-name/:id/:colId/', (req, res) => {
  const { id, colId } = req.params;
  const { changes } = req.body;

  let deckInformation;

  Deck.updateDeckName(id, colId, changes).then(response => {
    Deck.getDeckInfo(id, colId).then(snapshot => {
      snapshot.forEach(doc => {
        let deckInfo = doc.data();
        deckInformation = {
          deckName: deckInfo.deckName,
          deckLength: deckInfo.deckLength,
          createdBy: deckInfo.createdBy,
          exampleCard: deckInfo.exampleCard
        };
      });
      res.status(200).json({ deckInformation });
    });
  });
});

/**
 * @swagger
 *
 * /api/deck/update-deck-name/:id/:colId:
 *   put:
 *     description: Updates a Deck's Name
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *       - name: changes
 *         description: changes to be updated
 *         in: body
 *         required: true
 *         type: object
 *
 *     responses:
 *       '201':
 *         description: Updated Deck Information
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

router.put('/:id/:colId/:docId', (req, res) => {
  const { id, colId, docId } = req.params;
  const { changes } = req.body;

  Deck.editCard(id, colId, docId, changes)
    .then(response => {
      Deck.getCard(id, colId, docId).then(response => {
        res.status(200).json({ id: docId, card: response.data() });
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'the server failed to update the card' });
    });
});

/**
 * @swagger
 *
 * /api/deck/:id/:colId/:docId:
 *   put:
 *     description: Updates a card within a deck
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *       - name: docId
 *         description: card id
 *         in: params
 *         required: true
 *         type: string
 *       - name: changes
 *         description: changes to be updated
 *         in: body
 *         required: true
 *         type: object
 *
 *     responses:
 *       '201':
 *         description: Updated card object
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

router.post('/archive/:id/:colId', (req, res) => {
  let deckArr = [];
  const { id, colId } = req.params;
  let deckInformation;
  admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Archives')
    .get()
    .then(deckDoc => {
      if (!deckDoc.exists) {
        admin.db
          .collection('Users')
          .doc(id)
          .collection('UserInformation')
          .doc('Archives')
          .set({ obj: 'created' });
      }
    });
  Deck.getCards(id, colId)
    .then(col => {
      col.forEach(doc => {
        let card = doc.data();
        deckArr.push({
          id: doc.id,
          front: card.front,
          back: card.back,
          archived: card.archived
        });
        Deck.getDeckInfo(id, colId).then(snapshot => {
          snapshot.forEach(doc => {
            let deckInfo = doc.data();
            deckInformation = {
              deckName: colId,
              deckLength: deckInfo.deckLength,
              createdBy: deckInfo.createdBy,
              exampleCard: deckInfo.exampleCard
            };

            Deck.archiveDeck(id, colId, deckArr).then(response => {
              admin.db
                .collection('Users')
                .doc(id)
                .collection('UserInformation')
                .doc('Archives')
                .collection(colId)
                .doc('DeckInformation')
                .set(deckInformation)
                .then(response => {
                  Deck.deleteCards(id, colId, deckArr).then(response => {
                    Deck.deleteDeckInfo(id, colId);
                  });
                });
            });
          });
        });
      });
      res.status(201).json({ message: 'Deck has been archived' });
    })
    .catch(err => {
      res.status(500).json({ error: 'the server could not archive the deck' });
    });
});

/**
 * @swagger
 *
 * /api/deck/archive/:id/:colId:
 *   post:
 *     description: Moves a users deck into an archives subcollection
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *
 *     responses:
 *       '201':
 *         description: Moved selected deck into the archives
 *       '500':
 *          description: Deck could not be archived
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                description: error message
 *
 */

router.post('/remove-archive/:id/:colId', (req, res) => {
  let deckArr = [];
  const { id, colId } = req.params;
  let deckInformation;
  admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .get()
    .then(deckDoc => {
      if (!deckDoc.exists) {
        admin.db
          .collection('Users')
          .doc(id)
          .collection('UserInformation')
          .doc('Decks')
          .set({ obj: 'created' });
      }
    });
  Deck.getArchivedCards(id, colId)
    .then(col => {
      col.forEach(doc => {
        let card = doc.data();
        deckArr.push({
          id: doc.id,
          front: card.front,
          back: card.back,
          archived: card.archived
        });
        Deck.getArchivedInfo(id, colId).then(snapshot => {
          snapshot.forEach(doc => {
            let deckInfo = doc.data();
            deckInformation = {
              deckName: colId,
              deckLength: deckInfo.deckLength,
              createdBy: deckInfo.createdBy,
              exampleCard: deckInfo.exampleCard
            };

            Deck.postArchivedCards(id, colId, deckArr).then(response => {
              admin.db
                .collection('Users')
                .doc(id)
                .collection('UserInformation')
                .doc('Decks')
                .collection(colId)
                .doc('DeckInformation')
                .set(deckInformation)
                .then(response => {
                  Deck.deleteArchivedCards(id, colId, deckArr).then(
                    response => {
                      Deck.deleteArchivedInfo(id, colId);
                    }
                  );
                });
            });
          });
        });
      });
      res.status(201).json({ message: 'Deck has been retrieved' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'the server could not return the deck to Decks collection'
      });
    });
});

/**
 * @swagger
 *
 * /api/deck/remove-archive/:id/:colId:
 *   post:
 *     description: Moves a users deck from archives to Decks subcollection
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: params
 *         required: true
 *         type: string
 *       - name: colId
 *         description: Deck name
 *         in: params
 *         required: true
 *         type: string
 *
 *     responses:
 *       '201':
 *         description: Moved selected deck into the Decks subcollection
 *       '500':
 *          description: Deck could not be moved over
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                description: error message
 *
 */

module.exports = router;
