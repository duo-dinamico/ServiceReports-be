const {Joi} = require("celebrate");

const servicesSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("created_at").default("created_at"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        department_id: Joi.string().uuid(),
        created_by: Joi.string().uuid(),
        closed_by: Joi.string().uuid(),
    }),
};

const serviceSchema = {params: Joi.object({id: Joi.string().uuid()})};

const patchServiceSchema = {
    body: Joi.object({
        machine_id: Joi.string().uuid().required(),
        maintaned: Joi.boolean(),
        repaired: Joi.boolean(),
        operational: Joi.boolean(),
        comments: Joi.string().max(255),
    })
        .min(1)
        .required(),
};

module.exports = {servicesSchema, serviceSchema, patchServiceSchema};
