const admin = require('../config/firestore-config');

module.exports = {
  addProfile,
  getUser,
  updateUser
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

function updateUser(id, changes) {
  return admin.db
    .collection('Users')
    .doc(id)
    .set(changes, { merge: true });
}
