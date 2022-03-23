const {Joi} = require("celebrate");
const {fetchAllServices, updateService} = require("../models/services.models");
const {servicesResponseSchema, serviceResponseSchema} = require("../schemas/services");
const {getServiceService} = require("../services/services");

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
    updateService(req.params, req.body)
        .then(resolvedData => Joi.object(serviceResponseSchema).validateAsync({service: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
