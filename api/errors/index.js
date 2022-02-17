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

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, next) => {
    if (isCelebrateError(err)) {
        const errorBody = mapToJson(err.details);
        const newErr = Boom.badRequest(errorBody.query.details[0].message);
        res.status(newErr.output.statusCode).json({...newErr.output.payload, data: newErr.data});
    }
    if (Boom.isBoom(err)) {
        res.status(err.output.statusCode).json({...err.output.payload, data: err.data});
    } else {
        const serverErr = Boom.badImplementation("terrible implementation");
        console.log(err);
        res.status(serverErr.output.statusCode).json(serverErr.output.payload);
    }
};
