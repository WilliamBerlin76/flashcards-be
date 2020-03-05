const router = require('express').Router();

const usersRouter = require('../routes/usersRoute');
const demoDeckRouter = require('../routes/demoDeckRoute');
const deckRouter = require('../routes/deckRoute');
const publicRoutes = require('../routes/publicRoutes')

router.use('/demo', demoDeckRouter);
router.use('/users', usersRouter);
router.use('/deck', deckRouter);
router.use('/public', publicRoutes)

module.exports = router;
