const router = require('express').Router();

const usersRouter = require('../routes/usersRoute');
const demoDeckRouter = require('../routes/demoDeckRoute');

router.use('/demo', demoDeckRouter);
router.use('/users', usersRouter);

module.exports = router;
