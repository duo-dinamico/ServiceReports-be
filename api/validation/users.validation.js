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
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
