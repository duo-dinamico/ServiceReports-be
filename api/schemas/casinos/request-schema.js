const {Joi} = require("celebrate");

const casinosSchema = {
    params: Joi.object({}),
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        casino_id: Joi.string().uuid(),
    }),
};

const casinoSchema = {params: Joi.object({id: Joi.string().uuid()})};

const postCasinoSchema = {
    body: Joi.object({
        name: Joi.string().example("Casino Estoril").required(),
        location: Joi.string().example("Estoril").required(),
    })
        .min(1)
        .required(),
};

const patchCasinoSchema = {
    body: Joi.object({
        name: Joi.string(),
        location: Joi.string(),
    })
        .min(1)
        .required(),
};

module.exports = {casinosSchema, casinoSchema, postCasinoSchema, patchCasinoSchema};
