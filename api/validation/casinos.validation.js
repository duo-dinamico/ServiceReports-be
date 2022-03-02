const Boom = require("@hapi/boom");
const {validateCasinoById} = require("./utils/validation");

exports.validateCasinoExists = async (req, res, next) => {
    const {id} = req.params;
    const toValidate = [validateCasinoById(id)];
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        if (err.statusCode === 400) next(Boom.badRequest("The request wasn't valid, please try again", err));
        if (err.statusCode === 404) next(Boom.notFound("The request wasn't valid, please try again", err));
        next(err);
    }
};
