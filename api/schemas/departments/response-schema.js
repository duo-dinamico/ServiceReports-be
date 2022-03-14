const {Joi} = require("celebrate");

const departmentResponseSchema = {
    department: Joi.object({
        id: Joi.string().uuid().example("341ae597-6e26-4c2a-9966-26447522a21e").description("unique id in uuid v4"),
        name: Joi.string().example("Sala de Máquinas Estoril"),
        casino: Joi.object({
            id: Joi.string().uuid().example("4dca6671-7c73-4414-bf4c-0646d8c70ede").description("unique id in uuid v4"),
            name: Joi.string().example("Casino Estoril"),
            location: Joi.string().example("Estoril"),
        }),
        created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
    }),
};

const departmentsResponseSchema = {
    departments: Joi.array().items(departmentResponseSchema.department),
};

module.exports = {
    departmentsResponseSchema,
    departmentResponseSchema,
};
