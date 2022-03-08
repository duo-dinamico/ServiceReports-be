const {Joi} = require("celebrate");
const {fetchAllServices} = require("../models/services.models");
const {servicesResponseSchema} = require("../schemas/services");

exports.getAllServices = (req, res, next) => {
    fetchAllServices(req.query)
        .then(resolvedData => Joi.object(servicesResponseSchema).validateAsync({services: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
