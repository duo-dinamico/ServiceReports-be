const Boom = require("@hapi/boom");
const {validateDepartmentByName, validateclientById, validateDepartmentById} = require("./utils/validation");

exports.validateDepartmentExists = async (req, res, next) => {
    const {id} = req.params;
    const {name, client_id} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateDepartmentById(id));
    if (name && req.method !== "GET") toValidate.push(validateDepartmentByName(name));
    if (client_id) toValidate.push(validateclientById(client_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
