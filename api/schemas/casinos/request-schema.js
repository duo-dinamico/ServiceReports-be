const {Joi} = require("celebrate");

const casinosSchema = {
    params: Joi.object({}),
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        casino_id: Joi.string().uuid(),
    }),
};

module.exports = {casinosSchema};
