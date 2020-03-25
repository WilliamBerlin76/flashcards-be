const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'test') {
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.SERVICE_TYPE,
    project_id: process.env.SERVICE_PROJECT_ID,
    private_key_id: process.env.SERVICE_PRIVATE_KEY_ID,
    private_key: process.env.SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.SERVICE_CLIENT_EMAIL,
    client_id: process.env.SERVICE_CLIENT_ID,
    auth_uri: process.env.SERVICE_AUTH_URI,
    token_uri: process.env.SERVICE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.SERVICE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.SERVICE_CLIENT_X509_CERT_URL
  })
});
} else {
  const serviceAccount = require('../ServiceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

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
