const Boom = require("@hapi/boom");
const {
    validateServiceById,
    validateUserById,
    validateDepartmentById,
    validateDepartmentHasMachines,
    validateMachineHasRevisions,
} = require("./utils/validation");

exports.validateServiceExists = async (req, res, next) => {
    const {service_id} = req.params;
    const {user_id} = req.body;
    const toValidate = [];
    if (service_id) toValidate.push(validateServiceById(service_id));
    if (user_id) toValidate.push(validateUserById(user_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};

exports.validateServiceMachineDepartment = async (req, res, next) => {
    const {service_id, machine_id} = req.params;
    const {user_id, department_id} = req.body;
    const toValidate = [];
    if (service_id && machine_id)
        toValidate.push(validateServiceById(service_id), validateMachineHasRevisions(service_id, machine_id));
    if (user_id) toValidate.push(validateUserById(user_id));
    if (department_id)
        toValidate.push(validateDepartmentById(department_id), validateDepartmentHasMachines(department_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
