const admin = require('../config/firestore-config');

module.exports = {
  getDeckInfo,
  getCards,
  postCards,
  getListOfDecks
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
    const deck = admin.db.collection('Users').doc(uid).collection('UserInformation').doc('Decks').collection(colId).doc('DeckInformation').collection('Cards').doc(card.front)
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