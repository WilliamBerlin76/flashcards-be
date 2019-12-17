const router = require('express').Router();
const usersRouter = require('../routes/usersRoute');


router.use('/users', usersRouter)


module.exports = router;
