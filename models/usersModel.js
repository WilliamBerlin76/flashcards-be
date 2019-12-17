const admin = require('../config/firestore-config');

module.exports = {
  addProfile
};

function addProfile(id, details) {
  return admin.db
    .collection('Users')
    .doc(id)
    .set(details);
}
