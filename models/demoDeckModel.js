const admin = require('../config/firestore-config');

module.exports = {
  getAllDecks,
  getListOfDecks,
  getDeckById
};

function getAllDecks() {
  return admin.db.collection('DemoDeck').get();
}

function getListOfDecks(id) {
  return admin.db
    .collection('DemoDeck')
    .doc(id)
    .listCollections();
}

function getDeckById(id, colId) {
  return admin.db
    .collection('DemoDeck')
    .doc(id)
    .collection(colId)
    .get();
}
