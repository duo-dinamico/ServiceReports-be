const {Joi} = require("celebrate");

const departmentsSchema = {
    params: Joi.object({}),
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        department_id: Joi.string().uuid(),
    }),
};

module.exports = {departmentsSchema};
