const express = require('express');

const server = express();

const globalMiddleware = require('../config/middlewareConfig');
globalMiddleware(server)

const apiRouter = require('./api-router');

server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.send('welcome to the flashcards backend')
});

module.exports = server;