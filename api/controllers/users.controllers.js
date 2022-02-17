const {Joi} = require("celebrate");
const {fetchAllUsers} = require("../models/users.models");
const {usersResponseSchema} = require("../schemas/users");

exports.getAllUsers = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllUsers(req.query);
        const validatedData = await Joi.object(usersResponseSchema).validateAsync({users: resolvedData});
        res.status(200).json(validatedData);
        return;
    } catch (err) {
        next(err);
    }
};
