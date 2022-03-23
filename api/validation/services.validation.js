const Boom = require("@hapi/boom");
const {validateServiceById, validateMachineById} = require("./utils/validation");

exports.validateServiceExists = async (req, res, next) => {
    const {id} = req.params;
    const {machine_id} = req.body;
    const toValidate = [];
    if (id) toValidate.push(validateServiceById(id));
    if (machine_id) toValidate.push(validateMachineById(machine_id));
    try {
        await Promise.all(toValidate);
        next();
    } catch (err) {
        next(new Boom.Boom(err.message, {statusCode: err.statusCode}));
    }
};
