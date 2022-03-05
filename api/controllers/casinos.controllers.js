const {Joi} = require("celebrate");
const {fetchAllCasinos, fetchCasino, removeCasino} = require("../models/casinos.models");
const {casinosResponseSchema, casinoResponseSchema} = require("../schemas/casinos");

exports.getAllCasinos = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllCasinos(req.query);
        const validatedData = await Joi.object(casinosResponseSchema).validateAsync({casinos: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};

exports.getCasino = async (req, res, next) => {
    try {
        const resolvedData = await fetchCasino(req.params);
        const validatedData = await Joi.object(casinoResponseSchema).validateAsync({casino: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};

exports.deleteCasino = async (req, res, next) => {
    try {
        await removeCasino(req.params);
        res.status(204).json({});
    } catch (err) {
        next(err);
    }
};
