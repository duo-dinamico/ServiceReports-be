const {Joi} = require("celebrate");
const {fetchAllMachines} = require("../models/machines.models");
const {machinesResponseSchema} = require("../schemas/machines");

exports.getAllMachines = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllMachines(req.query);
        const validatedData = await Joi.object(machinesResponseSchema).validateAsync({machines: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};
