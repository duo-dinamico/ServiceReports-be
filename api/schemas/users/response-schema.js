const {Joi} = require("celebrate");

const userResponseSchema = {
    user: Joi.object({
        id: Joi.string().uuid().example("435ccd69-f989-4219-a3c7-9f09ff32c6cb").description("unique id in uuid v4"),
        username: Joi.string().example("jsilva"),
        name: Joi.string().example("João Carlos Silva"),
        created_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        updated_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp"),
        deleted_at: Joi.date().timestamp().example("2019-05-10T13:45:08.000Z").description("Timestamp").allow(null),
    }),
};

const usersResponseSchema = {
    users: Joi.array().items(userResponseSchema.user),
};

module.exports = {
    usersResponseSchema,
    userResponseSchema,
};
