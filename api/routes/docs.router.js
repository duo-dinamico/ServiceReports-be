const docsRouter = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const { methodNotAllowed } = require('../errors');

const swaggerDocument = require('../docs');

docsRouter.use('/', swaggerUi.serve);
docsRouter.get('/', swaggerUi.setup(swaggerDocument)).all(methodNotAllowed);

module.exports = docsRouter;
