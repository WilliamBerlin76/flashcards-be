const Users = require('../models/usersModel');
const verifyUser = require('../middleware/verifyUserId');

const router = require('express').Router();

///////// ADD PROFILE/////////
router.post('/', (req, res) => {
  const { id, details } = req.body;

  Users.addProfile(id, details)
    .then(user => {
      const retUser = {
        id: id,
        data: details
      };
      res.status(201).json(retUser);
    })
    .catch(err => {
      console.log('POSTING USER ERR', err);
      res
        .status(500)
        .json({ error: 'there was an error adding the user to the db' });
    });
});

////////// Get a User ///////////
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Users.getUser(id)
    .then(user => {
      if (!user.exists) {
        const details = { id: id };
        Users.addProfile(id, details).then(newUser => {
          const retUser = {
            id: newUser.id,
            data: details
          };
          res.status(201).json(retUser);
        });
      } else {
        const retUser = {
          id: user.id,
          data: user.data()
        };
        res.status(200).json(retUser);
      }
    })
    .catch(err => console.log(err));
});

/////// Update a User /////////
router.put('/:id', verifyUser.verifyUserId, (req, res) => {
  const { id } = req.params;
  const { changes } = req.body;

  Users.updateUser(id, changes)
    .then(seconds => {
      Users.getUser(id).then(user => {
        const retUser = {
          id: user.id,
          data: user.data()
        };
        res.status(200).json(retUser);
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'There was an error updating the user' });
    });
});

module.exports = router;
