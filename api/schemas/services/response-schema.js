const {Joi} = require("celebrate");

const serviceResponseSchema = {
    service: Joi.object({
        id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
        department: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            name: Joi.string().example("Sala de Máquinas Estoril"),
            client: Joi.string().example("client Espinho"),
        }),
        created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        closed_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
        deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
        created_by: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            username: Joi.string().example("jsilva"),
            name: Joi.string().example("João Carlos Silva"),
        }),
        updated_by: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            username: Joi.string().example("jsilva"),
            name: Joi.string().example("João Carlos Silva"),
        }),
        closed_by: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            username: Joi.string().example("jsilva"),
            name: Joi.string().example("João Carlos Silva"),
        }),
        deleted_by: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            username: Joi.string().example("jsilva"),
            name: Joi.string().example("João Carlos Silva"),
        }),
    }),
};

const servicesResponseSchema = {
    services: Joi.array().items(serviceResponseSchema.service),
};

module.exports = {
    servicesResponseSchema,
    serviceResponseSchema,
};
