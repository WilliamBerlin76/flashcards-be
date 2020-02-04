const firebase = require("@firebase/testing");
const admin = require('../config/firestore-config');
const chai = require('chai');
const assert = chai.assert;

const { getAllDecks, getListOfDecks, getDeckById } = require('../models/demoDeckModel');
const {addProfile, getUser, updateUser} = require('../models/usersModel')


// function authedApp(auth) {
//     return firebase.initializeTestApp({ projectId, auth }).firestore();
// }

// beforeEach(async () => {
// // Clear the database between tests
// await firebase.clearFirestoreData({ projectId });
// });

describe('demodeck models', () => {
    it("gets all demo decks", async () => {
        const demoDecks = admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy')
        await firebase.assertSucceeds(getAllDecks());
    })
    it("gets the list of demo decknames", async () => {
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology').doc('asdf').set({front: 'front'})
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme').doc('asdf').set({front: 'front'})
        const list = await getListOfDecks('I2r2gejFYwCQfqafWlVy')
        assert.lengthOf(list, 2);

        assert.equal(list[0]._queryOptions.collectionId, 'Biology')
        assert.equal(list[1]._queryOptions.collectionId, 'mNeme')
    })
    it("gets the deck by id", async () => {
        // const db = authedApp(null);
        admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology')
        admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme')
        await firebase.assertSucceeds(getDeckById('I2r2gejFYwCQfqafWlVy', 'mNeme'))
    })
});

describe('user models', async () => {
    it("adds a user profile given correct arguments", async () => {
        // const db = authedApp(null);
        await firebase.assertSucceeds(addProfile('25', {name: 'testUser'}))
    })
    it('gets a user by id', async () => {
        // const db = authedApp(null);
        await firebase.assertSucceeds(getUser('2'))
    })
    it('updates a users info', async () => {
        // const db = authedApp(null);
        await firebase.assertSucceeds(updateUser('25', {name: 'testing'}))
    })
})