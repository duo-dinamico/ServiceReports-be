const {Joi} = require("celebrate");

const usersSchema = {
    params: Joi.object({}),
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
    }),
};

module.exports = {usersSchema};
