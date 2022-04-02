const Boom = require("@hapi/boom");
const {validateClientById, validateClientByName} = require("./utils/validation");

exports.validateClientExists = async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateClientById(id));
    if (name && (req.method === "POST" || req.method === "PATCH")) toValidate.push(validateClientByName(name));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
