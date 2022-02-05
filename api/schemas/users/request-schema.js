const {Joi} = require("celebrate");

const usersSchema = {
    params: Joi.object({}),
};

module.exports = {usersSchema};
