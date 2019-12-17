const Users = require('../models/usersModel');

const router = require('express').Router();

///////// ADD PROFILE/////////
router.post('/', (req, res) => {
    const {id, details} = req.body;

    Users.addProfile(id, details)
        .then(user => {
            const retUser = {
                id: id,
                data: details
            };
            res.status(201).json(retUser)
        })
        .catch(err => {
            console.log('POSTING USER ERR', err)
            res.status(500).json({error: 'there was an error adding the user to the db'})
        })

});


module.exports = router;