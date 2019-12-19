const User = require('../models/usersModel');

module.exports = {
  verifyUserId
};

function verifyUserId(req, res, next) {
  const { id } = req.params;

  User.getUser(id).then(user => {
    if (user.exists) {
      next();
    } else {
      res.status(404).json({ error: 'There is no user with that id' });
    }
  });
}
