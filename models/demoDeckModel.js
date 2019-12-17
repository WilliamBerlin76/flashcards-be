const db = require('../config/firestore-config');

module.exports = {
    getAllCards
};

function getAllCards(){
    return db.collection('DemoDeck')
            .get()
};