const {Joi} = require("celebrate");

const userSchema = {params: Joi.object({id: Joi.string().uuid()})};

const usersSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        user_id: Joi.string().uuid(),
    }),
};

module.exports = {usersSchema, userSchema};
