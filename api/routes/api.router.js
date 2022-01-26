const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');

apiRouter.route('/').all(methodNotAllowed);

module.exports = apiRouter;
