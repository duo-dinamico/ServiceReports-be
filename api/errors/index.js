const Boom = require("@hapi/boom");

exports.methodNotAllowed = (_req, res) => {
    const error = Boom.methodNotAllowed("That method is not allowed, please used an allowable method");
    res.status(error.output.statusCode).json(error.output.payload);
};
