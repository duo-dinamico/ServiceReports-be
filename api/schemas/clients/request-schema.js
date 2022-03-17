const {Joi} = require("celebrate");

const clientsSchema = {
    params: Joi.object({}),
    query: Joi.object({
        sort_by: Joi.string().valid("name").default("name"),
        order: Joi.string().valid("asc", "desc").default("asc"),
        client_id: Joi.string().uuid(),
    }),
};

const clientSchema = {params: Joi.object({id: Joi.string().uuid()})};

const postclientSchema = {
    body: Joi.object({
        name: Joi.string().example("client Estoril").required(),
        location: Joi.string().example("Estoril").required(),
    })
        .min(1)
        .required(),
};

const patchclientSchema = {
    body: Joi.object({
        name: Joi.string(),
        location: Joi.string(),
    })
        .min(1)
        .required(),
};

module.exports = {clientsSchema, clientSchema, postclientSchema, patchclientSchema};
