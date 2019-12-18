const admin = require('../config/firestore-config');

module.exports = {
  getAllCards
};

function getAllCards() {
  return admin.db.collection('DemoDeck').get();
}
