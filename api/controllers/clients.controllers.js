const {Joi} = require("celebrate");
const {fetchAllclients, fetchclient, removeclient, addclient, updateclient} = require("../models/clients.models");
const {clientsResponseSchema, clientResponseSchema} = require("../schemas/clients");

exports.getAllclients = (req, res, next) => {
    fetchAllclients(req.query)
        .then(resolvedData => Joi.object(clientsResponseSchema).validateAsync({clients: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getclient = (req, res, next) => {
    fetchclient(req.params)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteclient = (req, res, next) => {
    removeclient(req.params).then(res.status(204).json({})).catch(next);
};

exports.postclient = (req, res, next) => {
    addclient(req.body)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};

exports.patchclient = (req, res, next) => {
    updateclient(req.params, req.body)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
