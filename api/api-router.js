const router = require('express').Router();

const usersRouter = require('../routes/usersRoute');
const demoDeckRouter = require('../routes/demoDeckRoute');
const deckRouter = require('../routes/deckRoute');
const publicRoutes = require('../routes/publicRoutes')
const metricsRoutes = require('../routes/metricsRoute')

router.use('/demo', demoDeckRouter);
router.use('/users', usersRouter);
router.use('/deck', deckRouter);
router.use('/public', publicRoutes)
router.use('/metrics', metricsRoutes)

module.exports = router;
