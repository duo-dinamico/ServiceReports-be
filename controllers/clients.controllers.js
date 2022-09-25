const {Joi} = require("celebrate");
const {fetchAllClients, fetchClient, removeClient, addClient, updateClient} = require("../models/clients.models");
const {clientsResponseSchema, clientResponseSchema} = require("../schemas/clients");

exports.getAllClients = (req, res, next) => {
    fetchAllClients(req.query)
        .then(resolvedData => Joi.object(clientsResponseSchema).validateAsync({clients: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getClient = (req, res, next) => {
    fetchClient(req.params)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteClient = (req, res, next) => {
    removeClient(req.params).then(res.status(204).json({})).catch(next);
};

exports.postClient = (req, res, next) => {
    addClient(req.body)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};

exports.patchClient = (req, res, next) => {
    updateClient(req.params, req.body)
        .then(resolvedData => Joi.object(clientResponseSchema).validateAsync({client: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
