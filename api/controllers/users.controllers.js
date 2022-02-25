const {Joi} = require("celebrate");
const {fetchAllUsers, removeUser, fetchUser, updateUser} = require("../models/users.models");
const {usersResponseSchema, userResponseSchema} = require("../schemas/users");

exports.getAllUsers = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllUsers(req.query);
        const validatedData = await Joi.object(usersResponseSchema).validateAsync({users: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const resolvedData = await fetchUser(req.params);
        const validatedData = await Joi.object(userResponseSchema).validateAsync({user: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await removeUser(req.params.id);
        res.status(204).json({});
    } catch (err) {
        next(err);
    }
};

exports.patchUser = async (req, res, next) => {
    try {
        const resolvedData = await updateUser(req.params.id, req.body);
        const validatedData = await Joi.object(userResponseSchema).validateAsync({user: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};
