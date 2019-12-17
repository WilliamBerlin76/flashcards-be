const router = require('express').Router();

const Demo = require('../models/demoDeckModel');

router.get('/', (req, res) => {
    const deckArr = [];

    Demo.getAllCards()
        .then(snapshot => {
            snapshot.forEach(doc => {
                deckArr.push({id: doc.id, data: doc.data()})
            });
            res.status(200).json(deckArr);
        })
        .catch(err => {
            console.log('GET DEMO DECK ERR', err);
            res.status(500).json({error: 'There was an error getting the deck from the server'})
        })
});

module.exports = router;