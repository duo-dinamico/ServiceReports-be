const {Joi} = require("celebrate");

const userSchema = {params: Joi.object({id: Joi.string().uuid()})};

const usersSchema = {
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        user_id: Joi.string().uuid(),
    }),
};

const patchUserSchema = {
    params: Joi.object({id: Joi.string().uuid()}),
    body: Joi.object({username: Joi.string(), name: Joi.string()}).min(1).required(),
};

const postUserSchema = {
    body: Joi.object({
        username: Joi.string()
            .pattern(/^[a-z]+$/)
            .required(),
        name: Joi.string().required(),
    })
        .min(1)
        .required(),
};

module.exports = {usersSchema, userSchema, patchUserSchema, postUserSchema};
