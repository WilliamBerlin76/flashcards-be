const db = require('../config/firestore-config');

module.exports = {
    addProfile
};

function addProfile(id, details){
    return db.collection('Users')
            .doc(id)
            .set(details)
};