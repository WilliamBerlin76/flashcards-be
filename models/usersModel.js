const admin = require('../config/firestore-config');

module.exports = {
  addProfile,
  getUser
};

function addProfile(id, details) {
  return admin.db
    .collection('Users')
    .doc(id)
    .set(details);
}

function getUser(id) {
  return admin.db
    .collection('Users')
    .doc(id)
    .get();
}
