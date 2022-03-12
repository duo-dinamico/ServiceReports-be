const Boom = require("@hapi/boom");
const {validateDepartmentByName, validateCasinoById, validateDepartmentById} = require("./utils/validation");

exports.validateDepartmentExists = async (req, res, next) => {
    const {id} = req.params;
    const {name, casino_id} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateDepartmentById(id));
    if (name && req.method !== "GET") toValidate.push(validateDepartmentByName(name));
    if (casino_id) toValidate.push(validateCasinoById(casino_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
