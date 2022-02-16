const {Joi} = require("celebrate");

const casinosResponseSchema = {
    casinos: Joi.array().items(
        Joi.object({
            id: Joi.string().uuid().example("4dca6671-7c73-4414-bf4c-0646d8c70ede").description("unique id in uuid v4"),
            name: Joi.string().example("Casino Estoril"),
            location: Joi.string().example("Estoril"),
            created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
            updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
            deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
        })
    ),
};

module.exports = {
    casinosResponseSchema,
};
