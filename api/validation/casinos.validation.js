const Boom = require("@hapi/boom");
const {validateCasinoById, validateCasinoByName} = require("./utils/validation");

exports.validateCasinoExists = async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateCasinoById(id));
    if (name && req.method === "POST") toValidate.push(validateCasinoByName(name));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        if (err.statusCode === 400) next(Boom.badRequest("The request wasn't valid, please try again", err));
        else if (err.statusCode === 404) next(Boom.notFound("The request wasn't valid, please try again", err));
        else next(err);
    }
};
