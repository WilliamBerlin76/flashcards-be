const firebase = require('@firebase/testing');

const Demo = require('../models/demoDeckModel');

const projectId = 'mNeme-tests';

function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

// beforeEach(async () => {
//   await firebase.clearFirestoreData({ projectId });
// });

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
});

describe('mNeme App', () => {
  it('Get All Decks', async () => {
    const db = authedApp(null);
    const deck = db.collection('demo').doc('demo-deck');
    await firebase.assertSucceeds(deck.get());
  });
});
