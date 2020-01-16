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
  getCard
};

function getDeckInfo(id, colId) {
  return admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .collection(colId)
    .get();
}

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

function getListOfDecks(id) {
  return admin.db
    .collection('Users')
    .doc(id)
    .collection('UserInformation')
    .doc('Decks')
    .listCollections();
}

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
      .doc(card.front);
      
      batch.delete(cards);
    });

  return batch.commit()
};

function deleteDeckInfo(uid, colId) {
  return admin.db.collection('Users')
          .doc(uid)
          .collection('UserInformation')
          .doc('Decks')
          .collection(colId)
          .doc('DeckInformation')
          .delete()
};

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