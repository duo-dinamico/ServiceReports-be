const {Joi} = require("celebrate");

const servicesSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("created_at").default("created_at"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        department_id: Joi.string().uuid(),
        created_by: Joi.string().uuid(),
        closed_by: Joi.string().uuid(),
        show_deleted: Joi.boolean(),
    }),
};

const serviceSchema = {params: Joi.object({service_id: Joi.string().uuid()})};

const patchServiceSchema = {
    params: Joi.object({service_id: Joi.string().uuid()}),
    body: Joi.object({
        user_id: Joi.string().uuid().required(),
        closed: Joi.boolean().required(),
    })
        .min(1)
        .required(),
};

const patchMachineRevisionSchema = {
    params: Joi.object({service_id: Joi.string().uuid(), machine_id: Joi.string().uuid()}),
    body: Joi.object({
        maintained: Joi.boolean(),
        repaired: Joi.boolean(),
        operational: Joi.boolean(),
        comments: Joi.string().max(255),
        user_id: Joi.string().uuid().required(),
    })
        .min(1)
        .required(),
};

const postServiceSchema = {
    body: Joi.object({
        user_id: Joi.string().uuid().required(),
        department_id: Joi.string().uuid().required(),
    })
        .min(1)
        .required(),
};

module.exports = {servicesSchema, serviceSchema, patchServiceSchema, patchMachineRevisionSchema, postServiceSchema};
