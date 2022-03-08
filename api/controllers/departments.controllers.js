const {Joi} = require("celebrate");
const {fetchAllDepartments} = require("../models/departments.models");
const {departmentsResponseSchema} = require("../schemas/departments");

exports.getAllDepartments = (req, res, next) => {
    fetchAllDepartments(req.query)
        .then(resolvedData => Joi.object(departmentsResponseSchema).validateAsync({departments: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};
