const {Joi} = require("celebrate");
const {fetchAllDepartments} = require("../models/departments.models");
const {departmentsResponseSchema} = require("../schemas/departments");

exports.getAllDepartments = async (req, res, next) => {
    try {
        const resolvedData = await fetchAllDepartments(req.query);
        const validatedData = await Joi.object(departmentsResponseSchema).validateAsync({departments: resolvedData});
        res.status(200).json(validatedData);
    } catch (err) {
        next(err);
    }
};
