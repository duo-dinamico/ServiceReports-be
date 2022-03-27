const {Joi} = require("celebrate");
const {fetchAllServices, updateMachineRevision, removeService} = require("../models/services.models");
const {servicesResponseSchema, serviceResponseSchema, machineRevisionResponseSchema} = require("../schemas/services");
const {getServiceService, patchServiceService, postServiceService} = require("../services/services");

exports.getAllServices = (req, res, next) => {
    fetchAllServices(req.query)
        .then(resolvedData => Joi.object(servicesResponseSchema).validateAsync({services: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getService = (req, res, next) => {
    getServiceService(req.params)
        .then(resolvedData => Joi.object(serviceResponseSchema).validateAsync({service: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.patchService = (req, res, next) => {
    patchServiceService(req.params, req.body)
        .then(resolvedData => Joi.object(serviceResponseSchema).validateAsync({service: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.patchMachineRevision = (req, res, next) => {
    updateMachineRevision(req.params, req.body)
        .then(resolvedData => Joi.object(machineRevisionResponseSchema).validateAsync({revision: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteService = (req, res, next) => {
    removeService(req.params, req.body).then(res.status(204).json({})).catch(next);
};

exports.postService = (req, res, next) => {
    postServiceService(req.body)
        .then(resolvedData => Joi.object(serviceResponseSchema).validateAsync({service: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};
