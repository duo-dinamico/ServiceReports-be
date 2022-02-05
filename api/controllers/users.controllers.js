const {Joi} = require("celebrate");
const {fetchAllUsers} = require("../models/users.models");
const {usersResponseSchema} = require("../schemas/users");

exports.getAllUsers = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllUsers();
        const validatedData = await Joi.object(usersResponseSchema).validateAsync({users: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};
