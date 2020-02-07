const admin = require('../config/firestore-config');
const chai = require('chai');
const assert = chai.assert;

const { getListOfDecks, getDeckById } = require('../models/demoDeckModel');
const {addProfile, getUser, updateUser} = require('../models/usersModel')


describe('demodeck models', () => {
    it("gets the list of demo decknames", async () => {
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology').doc('asdf').set({front: 'front'})
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme').doc('asdf').set({front: 'front'})
        const list = await getListOfDecks('I2r2gejFYwCQfqafWlVy');
        //check that list length is the same as the decks that were added
        assert.lengthOf(list, 2);

        // check that the decks were retrieved with accurate information
        assert.equal(list[0]._queryOptions.collectionId, 'Biology')
        assert.equal(list[1]._queryOptions.collectionId, 'mNeme')
    })
    it("gets the deck by id", async () => {
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('Biology').doc('asdf').set({front: 'front'});
        await admin.db.collection('DemoDeck').doc('I2r2gejFYwCQfqafWlVy').collection('mNeme').doc('asdf').set({front: 'front'});
        const deck = await getDeckById('I2r2gejFYwCQfqafWlVy', 'mNeme');
        
        // checks the colId to be sure that the correct deck was retrieved by ID
        assert.equal(deck._query._queryOptions.collectionId, 'mNeme');
    })
});

describe('user models', () => {
    it("adds a user profile given correct data, and retrieves a correct user by their id", async () => {
        let user;
        await addProfile('25', {name: 'testUser'});
        await getUser('25').then(res => user = res.data());
        
        // check that the name is accurate to the user that was retrieved
        assert.equal(user.name, 'testUser');
    })
    it('updates a users info', async () => {
        let user;
        await addProfile('25', {name: 'testUser'});
        await updateUser('25', {name: 'testUpdate'});
        await getUser('25').then(res => user = res.data());
        //check to see if update changed the selected user's name
        assert.equal(user.name, 'testUpdate')
    })
})