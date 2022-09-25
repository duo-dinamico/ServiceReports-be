const {Joi} = require("celebrate");

const serviceResponseSchema = {
    service: Joi.object({
        id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
        department: Joi.object({
            id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
            name: Joi.string().example("Sala de Máquinas Estoril"),
            client: Joi.string().example("client Espinho"),
        }),
        machines: Joi.array().items(
            Joi.object({
                id: Joi.string()
                    .uuid()
                    .example("f8cae396-5376-47ae-8dfc-690572e76a09")
                    .description("unique id in uuid v4"),
                manufacturer: Joi.string().example("TCS"),
                model: Joi.string().example("Chipper Champ 2"),
                serial_number: Joi.string().example("087610101A"),
                created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
                updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
                deleted_at: Joi.date()
                    .timestamp()
                    .example("2019-05-10T13:45:08.000Z")
                    .description("Timestamp")
                    .allow(null),
                revisions: Joi.array().items(
                    Joi.object({
                        id: Joi.string().uuid(),
                        service_id: Joi.string().uuid(),
                        machine_id: Joi.string().uuid(),
                        maintained: Joi.boolean(),
                        repaired: Joi.boolean(),
                        operational: Joi.boolean(),
                        comments: Joi.string().max(255).allow(null),
                        closed: Joi.boolean(),
                        deleted_at: Joi.date()
                            .timestamp()
                            .example("2019-05-10T13:45:08.000Z")
                            .description("Timestamp")
                            .allow(null),
                    })
                ),
            })
        ),
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
            id: Joi.string()
                .uuid()
                .example("435ccd69-f989-4219-a3c7-9f09ff32c6cb")
                .description("unique id in uuid v4")
                .allow(null),
            username: Joi.string().example("jsilva").allow(null),
            name: Joi.string().example("João Carlos Silva").allow(null),
        }),
        deleted_by: Joi.object({
            id: Joi.string()
                .uuid()
                .example("435ccd69-f989-4219-a3c7-9f09ff32c6cb")
                .description("unique id in uuid v4")
                .allow(null),
            username: Joi.string().example("jsilva").allow(null),
            name: Joi.string().example("João Carlos Silva").allow(null),
        }),
    }),
};

const servicesResponseSchema = {
    services: Joi.array().items(serviceResponseSchema.service),
};

const machineRevisionResponseSchema = {
    revision: Joi.object({
        id: Joi.string().uuid(),
        service_id: Joi.string().uuid(),
        machine_id: Joi.string().uuid(),
        maintained: Joi.boolean(),
        repaired: Joi.boolean(),
        operational: Joi.boolean(),
        comments: Joi.string().max(255),
        closed: Joi.boolean(),
        deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
    }),
};

module.exports = {
    servicesResponseSchema,
    serviceResponseSchema,
    machineRevisionResponseSchema,
};
