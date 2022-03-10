const {Joi} = require("celebrate");
const {fetchAllCasinos, fetchCasino, removeCasino, addCasino, updateCasino} = require("../models/casinos.models");
const {casinosResponseSchema, casinoResponseSchema} = require("../schemas/casinos");

exports.getAllCasinos = (req, res, next) => {
    fetchAllCasinos(req.query)
        .then(resolvedData => Joi.object(casinosResponseSchema).validateAsync({casinos: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getCasino = (req, res, next) => {
    fetchCasino(req.params)
        .then(resolvedData => Joi.object(casinoResponseSchema).validateAsync({casino: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteCasino = (req, res, next) => {
    removeCasino(req.params).then(res.status(204).json({})).catch(next);
};

exports.postCasino = (req, res, next) => {
    addCasino(req.body)
        .then(resolvedData => Joi.object(casinoResponseSchema).validateAsync({casino: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};

exports.patchCasino = (req, res, next) => {
    updateCasino(req.params, req.body)
        .then(resolvedData => Joi.object(casinoResponseSchema).validateAsync({casino: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
