const {Joi} = require("celebrate");
const {fetchAllMachines} = require("../models/machines.models");
const {machinesResponseSchema} = require("../schemas/machines");

exports.getAllMachines = (req, res, next) => {
    fetchAllMachines(req.query)
        .then(resolvedData => Joi.object(machinesResponseSchema).validateAsync({machines: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
