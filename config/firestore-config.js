const admin = require('firebase-admin');

let serviceAccount = require('../ServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function verifyUser(req, res, next) {
  const token = req.headers.authentication;
  admin
    .auth()
    .verifyIdToken(token)
    .then(pass => {
      next();
    })
    .catch(err => res.status(401).json({ error: 'You are not logged in!' }));
}

let db = admin.firestore();

module.exports = {
  db,
  verifyUser
};
