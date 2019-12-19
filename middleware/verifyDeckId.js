const Deck = require('../models/demoDeckModel');

module.exports = {
  verifyDeckId
};

function verifyDeckId(req, res, next) {
  const { id, colId } = req.params;

  Deck.getDeckById(id, colId).then(deck => {
    if (deck.docs.length > 0) {
      next();
    } else {
      res.status(404).json({ error: "That deck doesn't exist" });
    }
  });
}
