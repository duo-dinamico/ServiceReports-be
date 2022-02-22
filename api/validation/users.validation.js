const Boom = require("@hapi/boom");
const {validateUser} = require("./utils/validation");

exports.validateDeleteUser = async (req, res, next) => {
    const {id} = req.params;
    const toValidate = [validateUser(id)];
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(Boom.notFound("The request wasn't valid, please try again", err));
    }
};
