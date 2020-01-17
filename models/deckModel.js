const admin = require('../config/firestore-config');
const uuidv4 = require('uuid/v4');

module.exports = {
  getDeckInfo,
  getCards,
  postCards,
  getListOfDecks,
  deleteCards,
  deleteDeckInfo,
  editCard,
  getCard,
  updateDeckName
};

// Gets deck information
function getDeckInfo(id, colId) {
  return admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .collection(colId)
    .get();
}

// returns cards by user and deck id
function getCards(id, colId) {
  return admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .collection(colId)
    .doc('DeckInformation')
    .collection('Cards')
    .get();
}

// adds cards to a deck by user id and deck id
function postCards(uid, colId, cards) {
  let batch = admin.db.batch();
 
    cards.forEach(card => {
      const deck = admin.db
      .collection('Users')
      .doc(uid)
      .collection('UserInformation')
      .doc('Decks')
      .collection(colId)
      .doc('DeckInformation')
      .collection('Cards')
      .doc(`${uuidv4()}`);
      
      batch.set(deck, {
        front: card.front,
        back: card.back
      });
    });
  return batch.commit()
};

// gets list of decks by user id
function getListOfDecks(id) {
  return admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .listCollections();
}

// deletes specified cards from a deck by deck id and user id
function deleteCards(uid, colId, cards) {
  let batch = admin.db.batch();
 
    cards.forEach(card => {
      const cards = admin.db
      .collection('Users')
      .doc(uid)
      .collection('UserInformation')
      .doc('Decks').collection(colId)
      .doc('DeckInformation')
      .collection('Cards')
      .doc(card.id);
      
      batch.delete(cards);
    });

  return batch.commit()
};

// removes the deck information from a deck by deck id and user id
function deleteDeckInfo(uid, colId) {
  return admin.db.collection('Users')
          .doc(uid)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .delete()
};

// updates the name of a deck in the deckInformation doc by user id and deck id
function updateDeckName(uid, colId, changes) {
  return admin.db.collection('Users')
          .doc(uid)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .update({deckName: changes.deckName})
}

// edits a card by user id, deck id, and card id
function editCard(uid, colId, docId, changes) {
  return admin.db.collection('Users')
          .doc(uid)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .collection('Cards')
          .doc(docId)
          .set(changes)
};

// gets an individual card by user id, deck id, and card id
function getCard(uid, colId, docId) {
  return admin.db.collection('Users')
          .doc(uid)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .collection('Cards')
          .doc(docId)
          .get()
};