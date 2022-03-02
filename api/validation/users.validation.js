const Boom = require("@hapi/boom");
const {validateUserById, validateUserByUsername} = require("./utils/validation");

exports.validateUserExists = async (req, res, next) => {
    const {id} = req.params;
    const {username} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateUserById(id));
    if (username && req.method === "POST") toValidate.push(validateUserByUsername(username));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        if (err.statusCode === 400) next(Boom.badRequest("The request wasn't valid, please try again", err));
        if (err.statusCode === 404) next(Boom.notFound("The request wasn't valid, please try again", err));
        next(err);
    }
};
