const firebase = require("@firebase/testing");
const admin = require('../config/firestore-config');
const uuidv4 = require('uuid/v4');

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
    describe('postCards, getCards', () => {
        it("postCards adds cards to a deck. getCards returns all of the cards from the deck", async () => {
            const returnedCards = []
            const cards = [{front: 'front', back: 'back'},
                                {front: 'front', back: 'back'},
                                {front: 'front', back: 'back'}
                            ]
            await postCards('testUser', "testDeck", cards);
            const cardsList = await getCards('testUser', "testDeck")
            cardsList.forEach(doc => {
                return returnedCards.push(doc.data())
            })
            assert.lengthOf(returnedCards, 3)
            
        });
        it("archived is automatically set to false on card creation", async () => {
            const cards = [{front: 'front', back: 'back'},
                         {front: 'front', back: "back"}]
            const returnedCards = [];
            await postCards("1234", "Spanish", cards)
            const cardsList = await getCards("1234", "Spanish")
            cardsList.forEach(doc => {
                return returnedCards.push(doc.data())
            })
            assert.equal(returnedCards[0].archived, false);
        });
    });
    describe('deleteCards', () => {
        it('removes multiple selected cards from a deck', async () => {
            const returnedIds = [];
            const lastCards = [];
            let count = 0;
            const cards = [{front: 'front', back: 'back'},
                                {front: 'front', back: 'back'},
                                {front: 'front', back: 'back'}]
            //add cards to deck
            await postCards('test', "Deck", cards)
            const cardsList = await getCards("test", "Deck")
            cardsList.forEach(doc => {
                /* populates array of card Ids that exist in the db
                   array will be sent to the function to specify cards to delete 
                */
                count === 3 ? count = 3 : count ++;
                count < 3 ? returnedIds.push({id: doc.id}) : null;
            });
            // delete array of cards specified in above forEach
            await deleteCards('test', 'Deck', returnedIds)
            const newCardsList = await getCards("test", "Deck")
            newCardsList.forEach(doc => {
                // sets final returned cards to an array
                lastCards.push(doc.data())
            });
            assert.lengthOf(lastCards, 1);
        });
    });
});