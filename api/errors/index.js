const Boom = require("@hapi/boom");
const {isCelebrateError} = require("celebrate");

const mapToJson = map => {
    const properties = {};
    map.forEach((item, key) => {
        if (typeof key === "object") {
            properties[key.elementName] = item;
        } else {
            properties[key] = item;
        }
    });
    return properties;
};

exports.methodNotAllowed = (_req, res) => {
    const error = Boom.methodNotAllowed("That method is not allowed, please used an allowed method");
    res.status(error.output.statusCode).json(error.output.payload);
};

exports.errorHandler = (err, _req, res, next) => {
    if (isCelebrateError(err)) {
        const errorBody = mapToJson(err.details);
        let newErr;
        if (errorBody.query) newErr = Boom.badRequest(errorBody.query.details[0].message);
        if (errorBody.params) newErr = Boom.badRequest(errorBody.params.details[0].message);
        if (errorBody.body) newErr = Boom.badRequest(errorBody.body.details[0].message);
        res.status(newErr.output.statusCode).json({...newErr.output.payload});
    } else if (Boom.isBoom(err)) {
        res.status(err.output.statusCode).json({...err.output.payload});
    } else {
        const serverErr = Boom.badImplementation("terrible implementation");
        res.status(serverErr.output.statusCode).json(serverErr.output.payload);
    }
};
