const firebase = require("@firebase/testing");
const assert = require('assert');
const fs = require("fs");
const { getAllDecks, getListOfDecks, getDeckById } = require('../models/demoDeckModel');

const projectId = "flashcards-test";

const coverageUrl = `http://localhost:8888/emulator/v1/projects/${projectId}:ruleCoverage.html`;

function authedApp(auth) {
    return firebase.initializeTestApp({ projectId, auth }).firestore();
}

beforeEach(async () => {
// Clear the database between tests
await firebase.clearFirestoreData({ projectId });
});

describe('demodeck models', () => {
    it("gets all demo decks", async () => {
        const db = authedApp(null);
        const demoDecks = db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy')
        await firebase.assertSucceeds(getAllDecks());
    })
    it("gets the list of demo decknames", async () => {
        const db = authedApp(null);
        db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology')
        db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme')
        const list = getListOfDecks('I2r2gejFYwCQfqafWlVy')
        await firebase.assertSucceeds(list.length = 2)
    })
    it("gets the deck by id", async () => {
        const db = authedApp(null);
        db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology')
        db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme')
        await firebase.assertSucceeds(getDeckById('I2r2gejFYwCQfqafWlVy', 'mNeme'))
    })
})