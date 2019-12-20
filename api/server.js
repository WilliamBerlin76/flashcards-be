const express = require('express');

const server = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'mNeme API',
      description: 'API for mNeme Flashcards and Users',
      contact: {
        name: 'mNeme'
      },
      servers: ['http://localhost:5000', 'https://flashcards-be.herokuapp.com/']
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const globalMiddleware = require('../config/middlewareConfig');
globalMiddleware(server);

const apiRouter = require('./api-router');

server.use('/api', apiRouter);

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

server.get('/', (req, res) => {
  res.send('welcome to the flashcards backend');
});

module.exports = server;
