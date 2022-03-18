const {Joi} = require("celebrate");
const {fetchAllMachines, fetchMachine, updateMachine, removeMachine, addMachine} = require("../models/machines.models");
const {machinesResponseSchema, machineResponseSchema} = require("../schemas/machines");

exports.getAllMachines = (req, res, next) => {
    fetchAllMachines(req.query)
        .then(resolvedData => Joi.object(machinesResponseSchema).validateAsync({machines: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getMachine = (req, res, next) => {
    fetchMachine(req.params)
        .then(resolvedData => Joi.object(machineResponseSchema).validateAsync({machine: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.patchDepartment = (req, res, next) => {
    updateMachine(req.params, req.body)
        .then(resolvedData => Joi.object(machineResponseSchema).validateAsync({machine: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteMachine = (req, res, next) => {
    removeMachine(req.params).then(res.status(204).json({})).catch(next);
};

exports.postMachine = (req, res, next) => {
    addMachine(req.body)
        .then(resolvedData => Joi.object(machineResponseSchema).validateAsync({machine: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};
