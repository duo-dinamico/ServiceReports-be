const {Joi} = require("celebrate");

const machinesSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("manufacturer", "model").default("manufacturer"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        machine_id: Joi.string().uuid(),
        manufacturer: Joi.string(),
        model: Joi.string(),
    }),
};

module.exports = {machinesSchema};
