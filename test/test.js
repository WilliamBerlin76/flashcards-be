const firebase = require("@firebase/testing");
const fs = require("fs");
const { getAllDecks, getListOfDecks } = require('../models/demoDeckModel');

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
})