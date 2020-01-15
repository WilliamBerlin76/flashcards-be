const admin = require('../config/firestore-config');

module.exports = {
  getDeckInfo,
  getCards
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
