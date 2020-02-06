const admin = require('../config/firestore-config');
const chai = require('chai');
const assert = chai.assert;


const { 
    getDeckInfo,
    getCards,
    postCards,
    deleteCards,
    editCard
} = require('../models/deckModel');

describe('card models', () => {
    const cards = [{front: 'front', back: 'back'},
                    {front: 'front', back: 'back'},
                    {front: 'front', back: 'back'}]
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
            
            await postCards('testUser', "testDeck", cards);
            const cardsList = await getCards('testUser', "testDeck")
            cardsList.forEach(doc => {
                return returnedCards.push(doc.data())
            })
            assert.lengthOf(returnedCards, 3)
            
        });
        it("archived is automatically set to false on card creation", async () => {
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
    describe('editCard', () => {
        it('updates selected cards', async () => {
            let count = 0;
            let returnedCards = [];
            let lastArr = [];
            await postCards('user', "deck", cards);
            const cardsList = await getCards("user", "deck")
            
            cardsList.forEach(doc => {
                /* 
                    card contains the id to send to the db along with the changes that
                    will be sent specifically for the id
                */
               const card = {
                                id: doc.id, 
                                front: "Changed front", 
                                back: "changed back", 
                                archived: true
                            }
               count === 3 ? count = 3 : count ++;
               count < 3 ? returnedCards.push(card) : null;
            });
            // edit cards in the deck in the db
            await editCard('user', 'deck', returnedCards )

            //check updated cards for the changes
            const updatedCards = await getCards('user', 'deck')
            updatedCards.forEach(doc => {
                doc.data().archived === true ? lastArr.push(doc.data()) : null
            })
            // check that only the selected cards were updated
            assert.lengthOf(lastArr, 2);
            // check that the value was actually updated as specified
            assert.equal(returnedCards[0,1].archived, true);
        })
    })
});