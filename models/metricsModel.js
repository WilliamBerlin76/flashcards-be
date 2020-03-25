const admin = require('../config/firestore-config');

module.exports = {
    getMetrics,
    addMetrics
}

function getMetrics(id, date) {
    return admin.db.doc(`Users/${id}/StudyDates/${date}`).get()
        
}


function addMetrics(id, date, metrics) {
    return admin.db.doc(`Users/${id}/StudyDates/${date}`)
    .set(metrics)
}