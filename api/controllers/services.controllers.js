const {Joi} = require("celebrate");
const {fetchAllServices} = require("../models/services.models");
const {servicesResponseSchema} = require("../schemas/services");

exports.getAllServices = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllServices(req.query);
        const validatedData = await Joi.object(servicesResponseSchema).validateAsync({services: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        console.log("next");
        next(err);
    }
};
