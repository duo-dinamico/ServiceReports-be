const Boom = require("@hapi/boom");
const {validateMachineByManufacturer, validateMachineById, validateDepartmentById} = require("./utils/validation");

exports.validateMachineExists = async (req, res, next) => {
    const {id} = req.params;
    const {serial_number, department_id} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateMachineById(id));
    if (serial_number && req.method !== "GET") toValidate.push(validateMachineByManufacturer(req.body));
    if (department_id) toValidate.push(validateDepartmentById(req.body.department_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
