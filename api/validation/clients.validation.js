const Boom = require("@hapi/boom");
const {validateclientById, validateclientByName} = require("./utils/validation");

exports.validateclientExists = async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateclientById(id));
    if (name && (req.method === "POST" || req.method === "PATCH")) toValidate.push(validateclientByName(name));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
