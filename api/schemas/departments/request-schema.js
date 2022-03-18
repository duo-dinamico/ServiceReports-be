const {Joi} = require("celebrate");

const departmentsSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        department_id: Joi.string().uuid(),
    }),
};

const departmentSchema = {params: Joi.object({id: Joi.string().uuid()})};

const patchDepartmentSchema = {
    body: Joi.object({
        name: Joi.string(),
        client_id: Joi.string().uuid(),
    })
        .min(1)
        .required(),
};

const postDepartmentSchema = {
    body: Joi.object({
        name: Joi.string().example("Bancadas do client").required(),
        client_id: Joi.string().uuid().example("446470f4-aeff-4fb7-9b53-38b434ca2488").required(),
    })
        .min(1)
        .required(),
};

module.exports = {departmentsSchema, departmentSchema, patchDepartmentSchema, postDepartmentSchema};
