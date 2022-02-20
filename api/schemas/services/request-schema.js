const {Joi} = require("celebrate");

const servicesSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("created_at").default("created_at"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        department_id: Joi.string().uuid(),
        user_id: Joi.string().uuid(),
        created_by: Joi.string().uuid(),
        closed_by: Joi.string().uuid(),
    }),
};

module.exports = {servicesSchema};
