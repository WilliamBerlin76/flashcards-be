const router = require('express').Router();

const usersRouter = require('../routes/usersRoute');
const demoDeckRouter = require('../routes/demoDeckRoute');
const deckRouter = require('../routes/deckRoute');

router.use('/demo', demoDeckRouter);
router.use('/users', usersRouter);
router.use('/deck', deckRouter);

module.exports = router;
