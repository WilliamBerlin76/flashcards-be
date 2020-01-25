const firebase = require("@firebase/testing");
const admin = require('../config/firestore-config');

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();


const fs = require("fs");
const { 
    getDeckInfo,
    getCards,
    postCards,
    getListOfDecks,
    deleteCards,
    deleteDeckInfo,
    editCard,
    getCard,
    updateDeckName,
    archiveDeck,
    unArchiveDeck,
    deleteArchivedInfo,
    deleteArchivedCards,
    getArchivedInfo,
    getArchivedCards,
    postArchivedCards,
    getListOfArchivedDecks 
} = require('../models/deckModel');

const projectId = "flashcards-test";

const coverageUrl = `http://localhost:8888/emulator/v1/projects/${projectId}:ruleCoverage.html`;

function authedApp(auth) {
    return firebase.initializeTestApp({ projectId, auth }).firestore();
};

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
});

describe('deck models', () => {
    
    it("DeckInfo is set and can be retrieved as an object", async () => {
        // const db = authedApp(null)
        let deckInformation
        await admin.db.collection('Users')
                        .doc('1223')
                        .collection('UserInformation')
                        .doc('Decks')
                        .collection('Biology')
                        .doc('DeckInformation')
                        .set({createdBy: 'user',
                              length: 5,
                              exampleCard: 'spanish'
                    })
        const retrievedInfo = await getDeckInfo('1223', 'Biology')
        retrievedInfo.forEach(doc => {
            deckInformation = doc.data()
        })
        assert.typeOf(deckInformation, 'object')
    })
    it("gets the cards", async () => {
        const db = authedApp(null)
        await firebase.assertSucceeds(getCards)
    })
    it("archived is automatically set to false on card creation", async () => {
        const db = authedApp(null)
        const cards = [{front: 'front', back: 'back'},
                     {front: 'front', back: "back"}]
        const returnedCards = [];
        await firebase.assertSucceeds(postCards("1234", "Spanish", cards))
        const cardsList = await getCards("1234", "Spanish")
        cardsList.forEach(doc => {
            return returnedCards.push(doc.data())
        })
        assert.equal(returnedCards[0].archived, false);
    })
})