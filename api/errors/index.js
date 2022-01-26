const Boom = require('@hapi/boom');

exports.methodNotAllowed = (_req, res) => {
  const error = Boom.methodNotAllowed('That method is not allowed, please used an allowable method');
  res.status(error.output.statusCode).json(error.output.payload);
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, next) => {
  if (Boom.isBoom(err)) {
    res.status(err.output.statusCode).json({ ...err.output.payload, data: err.data });
  } else {
    console.error(err);
    const serverErr = Boom.badImplementation('terrible implementation');
    res.status(serverErr.output.statusCode).json(serverErr.output.payload);
  }
};
