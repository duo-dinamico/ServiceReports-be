const {Joi} = require("celebrate");

const machinesResponseSchema = {
    machines: Joi.array().items(
        Joi.object({
            id: Joi.string().uuid().example("f8cae396-5376-47ae-8dfc-690572e76a09").description("unique id in uuid v4"),
            manufacturer: Joi.string().example("TCS"),
            model: Joi.string().example("Chipper Champ 2"),
            serial_number: Joi.string().example("087610101A"),
            department: Joi.object({
                id: Joi.string()
                    .uuid()
                    .example("a7895b03-70a2-4bab-8e0f-dbc561e6d098")
                    .description("unique id in uuid v4"),
                name: Joi.string().example("Bancados Espinho"),
                client: Joi.string().example("client Espinho"),
            }),
            created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
            updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
            deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
        })
    ),
};

module.exports = {
    machinesResponseSchema,
};
