const {Joi} = require("celebrate");
const {fetchAllCasinos} = require("../models/casinos.models");
const {casinosResponseSchema} = require("../schemas/casinos");

exports.getAllCasinos = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllCasinos(req.query);
        const validatedData = await Joi.object(casinosResponseSchema).validateAsync({casinos: resolvedData});
        res.status(200).json(validatedData);
        return;
    } catch (err) {
        next(err);
    }
};
