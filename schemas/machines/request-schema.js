const {Joi} = require("celebrate");

const machinesSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("manufacturer", "model").default("manufacturer"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        machine_id: Joi.string().uuid(),
        manufacturer: Joi.string(),
        model: Joi.string(),
        department_id: Joi.string().uuid(),
    }),
};

const machineSchema = {params: Joi.object({id: Joi.string().uuid()})};

const patchMachineSchema = {
    body: Joi.object({
        manufacturer: Joi.string(),
        model: Joi.string(),
        serial_number: Joi.string(),
        department_id: Joi.string().uuid(),
    })
        .min(1)
        .required(),
};

const postMachineSchema = {
    body: Joi.object({
        manufacturer: Joi.string().example("Machine manufacturer").required(),
        model: Joi.string().example("Series A").required(),
        serial_number: Joi.string().example("12345").required(),
        department_id: Joi.string().uuid().example("446470f4-aeff-4fb7-9b53-38b434ca2488").required(),
    })
        .min(1)
        .required(),
};

module.exports = {machinesSchema, machineSchema, patchMachineSchema, postMachineSchema};
