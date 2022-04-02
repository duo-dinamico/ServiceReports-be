const {Joi} = require("celebrate");
const {fetchAllUsers, removeUser, fetchUser, updateUser, addUser} = require("../models/users.models");
const {usersResponseSchema, userResponseSchema} = require("../schemas/users");

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers(req.query)
        .then(resolvedData => Joi.object(usersResponseSchema).validateAsync({users: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getUser = (req, res, next) => {
    fetchUser(req.params)
        .then(resolvedData => Joi.object(userResponseSchema).validateAsync({user: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteUser = (req, res, next) => {
    removeUser(req.params.id).then(res.status(204).json({})).catch(next);
};

exports.patchUser = (req, res, next) => {
    updateUser(req.params.id, req.body)
        .then(resolvedData => Joi.object(userResponseSchema).validateAsync({user: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.postUser = (req, res, next) => {
    addUser(req.body)
        .then(resolvedData => Joi.object(userResponseSchema).validateAsync({user: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};
