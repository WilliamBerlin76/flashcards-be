const router = require('express').Router();
const admin = require('../config/firestore-config');

const Deck = require('../models/deckModel');

// This route is to return a list of decks that a user has archived
router.get('/:id/archive', (req, res) => {
  const { id } = req.params;
  const deckArr = [];
  const infoArr = [];

  // See deckModel.js for more details on what each function is doing
  Deck.getListOfArchivedDecks(id) // this will return an object that we will loop through and push the id's to deckArr; the id's are currently set to the deck's name
    .then(collections => {
      if (collections.length > 0) {
        for (let collection of collections) {
          deckArr.push(collection.id);
        }

        deckArr.forEach(deck => {
          Deck.getArchivedInfo(id, deck).then(snapshot => {
            // this will retrieve the information that is stored in Firestore for each deck such as it's name, id, how long it is, etc.
            snapshot.forEach(doc => {
              let deckInfo = doc.data(); // to be able to actually view the data that is returned rather than the entire Firestore object you have to run .data(); the returned information is then pushed to infoArr which will ultimately be returned to the client
              infoArr.push(deckInfo);
            });
            if (infoArr.length == deckArr.length) {
              res.status(200).json(infoArr);
            }
          });
        });
      } else {
        res.status(200).json(deckArr);
      }
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

// this route will return all of the cards from a specifec archived deck
router.get('/:id/:colId/archive', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getArchivedInfo(id, colId) // we first retrieve the information for the deck in archive
    .then(snapshot => {
      Deck.getArchivedCards(id, colId).then(col => {
        // then we retrieve each of the cards; each card is its own document in Firestore so we have to loop through them and set their information to match what the front end will be expecting
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
          deckInformation = deckInfo; // before sending the response we set the deck information as well
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

// this route will delete an archived deck; regular decks and archived decks look identical in Firestore but are stored in different areas, thus requiring different routes for deleting each
router.delete('/:id/:colId/delete-archived-deck', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];

  Deck.getArchivedCards(id, colId).then(col => {
    // we first retrieve all of the cards for the deck to be deleted; Firestore will not delete documents of a sub-collection when the sub-collection is deleted so we have to delete those first
    col.forEach(doc => {
      let card = doc.data();
      deckArr.push({ id: doc.id, front: card.front, back: card.back });
    });
    Deck.deleteArchivedCards(id, colId, deckArr).then(deck => {
      Deck.deleteArchivedInfo(id, colId).then(response => {
        // after the cards are deleted we can delete the archived deck's information and remove it from the database
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

// this route is to get all of the decks for a specific user; it is set up in a similar manner to retrieving the archived decks
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const deckArr = [];
  const infoArr = [];

  Deck.getListOfDecks(id)
    .then(collections => {
      if (collections.length > 0) {
        for (let collection of collections) {
          deckArr.push(collection.id); // we get an object with all of the decks and push the id of each to its own array
        }
        deckArr.forEach(deck => {
          Deck.getDeckInfo(id, deck).then(snapshot => {
            // then we loop through that array and retrieve the information for each deck and then return that information to the client
            snapshot.forEach(doc => {
              let deckInfo = doc.data();
              infoArr.push(deckInfo);
            });
            if (infoArr.length == deckArr.length) {
              res.status(200).json(infoArr);
            }
          });
        });
      } else {
        res.status(200).json(deckArr);
      }
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

// this route is to retrieve all of the cards in a given deck
router.get('/:id/:colId', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;

  Deck.getDeckInfo(id, colId) // we first retrieve the deck's information
    .then(snapshot => {
      Deck.getCards(id, colId).then(col => {
        // then we retrieve all of the cards
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            data: card // we chose to set up the object for each card in this manner to match what we had done with the demo decks so that it was consistant on the front end
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = deckInfo; // finally we return the deck information as well
        });
        res.status(200).json({ deckInformation, data: deckArr });
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

// this route is for creating a deck
router.post('/:id/:colId', (req, res) => {
  const { cards, deck } = req.body; // cards is an array of all the card objects that a user wants to add to the new deck; deck is an object that contains the tags and icons that a user wants to add to the new deck; deck would also be where any other information such as public/private would be added
  const { id, colId } = req.params;
  let deckArr = [];
  let deckInformation;
  let batch = admin.db.batch();
  // we check to see if a user has a 'Decks' document on Firestore. They should have one if they have created any decks in the past; due to some of the nuances of Firestore it will actually create the deck without this step however it can cause some issues if done that way
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
  Deck.postCards(id, colId, cards) // we first post the cards to the deck which will also create the deck itself, but it will not have any information stored on the 'DeckInformation' document; that we set after the cards post successfully
    .then(response => {
      const deckInfo = {
        createdBy: id,
        collectionId: colId,
        deckName: colId,
        deckLength: cards.length,
        exampleCard: cards[0].front,
        tags: deck.tags,
        icon: deck.icon
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
              // we then retrieve the new deck's information and cards and return those to the client
              col.forEach(doc => {
                let card = doc.data();
                deckArr.push({
                  id: doc.id,
                  data: card
                });
              });
              snapshot.forEach(doc => {
                let deckInfo = doc.data();
                deckInformation = deckInfo;
              });
              res.status(200).json({ deckInformation, data: deckArr });
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

// this route is for adding cards to an existing deck; we will retain this route here if a future team has need of it, but currently we use the same route as creating a deck to add cards to it. That is possible because when using .set() in firestore it will look for that document and rather than overwriting what is there it will just add to it. Funtionally this endpoint is very similar to creating a deck but doesn't require the deck information to be passed in (ie. tags, icon).
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
            data: card
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInfo = { ...deckInfo, deckLength: deckArr.length };
          deckInformation = deckInfo;
          admin.db
            .collection('Users')
            .doc(id)
            .collection('UserInformation')
            .doc('Decks')
            .collection(colId)
            .doc('DeckInformation')
            .update({ deckLength: deckArr.length })
            .then(response => {
              res.status(200).json({ deckInformation, data: deckArr });
            });
        });
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

// this endpoint is for deleting specific cards from a deck
router.delete('/:id/:colId/delete-cards', (req, res) => {
  const { id, colId } = req.params;
  const { cards } = req.body;

  let deckInformation;
  let deckArr = [];

  Deck.deleteCards(id, colId, cards).then(snapshot => {
    Deck.getDeckInfo(id, colId).then(snapshot => {
      //after deleting the cards we return the deck information and the remaining cards in the deck
      Deck.getCards(id, colId).then(col => {
        col.forEach(doc => {
          let card = doc.data();
          deckArr.push({
            id: doc.id,
            data: card
          });
        });
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = {
            ...deckInfo,
            deckLength: deckArr.length,
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
            exampleCard: deckArr[0].data.front
          })
          .then(response => {
            res.status(200).json({ deckInformation, data: deckArr });
          });
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

// this route will delete a deck and all of its cards
router.delete('/:id/:colId/delete-deck', (req, res) => {
  const { id, colId } = req.params;
  let deckArr = [];

  Deck.getCards(id, colId).then(col => {
    // similar to deleting an archived deck we have to get all of the cards for the deck and delete those first before we can delete the deck itself.
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

// this route is for updating the deck's name. Do NOT use this route unless you modify both the front end and the back end to use something other than the desired deck name for the collection id. A collection id cannot be changed; the deck name field inside of 'DeckInformation' can. In many places we use the collection id rather than that deck name on the front end; updating it would show no real change to the user.
router.put('/update-deck-name/:id/:colId/', (req, res) => {
  const { id, colId } = req.params;
  const { changes } = req.body;

  let deckInformation;

  Deck.updateDeckName(id, colId, changes)
    .then(response => {
      Deck.getDeckInfo(id, colId).then(snapshot => {
        // for updating we pass in the desired changes to be made and then return the updated object
        snapshot.forEach(doc => {
          let deckInfo = doc.data();
          deckInformation = deckInfo;
        });
        res.status(200).json({ deckInformation });
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'there was an error updating your deck name' });
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

// this route is for updating cards within a deck
router.put('/update/:id/:colId/', (req, res) => {
  const { id, colId } = req.params;
  const { changes } = req.body; //the changes passed in is an array of all the card objects to be updated. We chose to set it up this way so that that we could use .set() rather than .update(). For .update() we would need to pass in which field is being updated whereas .set() will just overwrite what is already there with an entirely new object.

  const deckArr = [];
  Deck.editCard(id, colId, changes)
    .then(response => {
      Deck.getDeckInfo(id, colId).then(snapshot => {
        Deck.getCards(id, colId).then(col => {
          col.forEach(doc => {
            let card = doc.data();
            deckArr.push({
              // after editing we return the updated deck to the user
              id: doc.id,
              data: card
            });
          });
          snapshot.forEach(doc => {
            let deckInfo = doc.data();
            deckInformation = deckInfo;
          });
          res.status(201).json({ deckInformation, data: deckArr });
        });
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'the server failed to update the card' });
    });
});

/**
 * @swagger
 *
 * /api/deck/update/:id/:colId:
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
 *       - name: changes
 *         description: changes to be updated
 *         in: body
 *         required: true
 *         type: object
 *
 *     responses:
 *       '201':
 *         description: Updated card array
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

// this route will archive a specific deck
router.post('/archive/:id/:colId', (req, res) => {
  let deckArr = [];
  const { id, colId } = req.params;
  let deckInformation;
  // first we check to see if the user has an 'Archives' document; we do this for the same reasons as above for checking to see if a 'Decks' document exists before creating a deck of cards
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
  // Archiving and un-archiving decks are probably the most complicated endpoints that we have. First we retrieve all of the cards in the deck and that decks information. Then we create that deck within the archives portion of a user on the database and set the archived decks infomration to the original deck's information. After that has finished we delete all of the cards of the original deck and then delete the original decks information leaving only the archived deck. We return a success message. Un-archiving a card is essentially doing the same thing just starting in 'Archives' and finishing in 'Decks' ie. in reverse order.
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
            deckInformation = deckInfo;

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

// this route is for un-archiving a deck; see the above endpoint for more information on what is happening here
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
            deckInformation = deckInfo;

            Deck.postArchivedCards(id, colId, deckArr).then(response => {
              // this is posting cards from archived decks to the new un-archived deck
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
