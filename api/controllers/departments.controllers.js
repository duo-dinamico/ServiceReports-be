const {Joi} = require("celebrate");
const {
    fetchAllDepartments,
    fetchDepartment,
    updateDepartment,
    removeDepartment,
    addDepartment,
} = require("../models/departments.models");
const {departmentsResponseSchema, departmentResponseSchema} = require("../schemas/departments");

exports.getAllDepartments = (req, res, next) => {
    fetchAllDepartments(req.query)
        .then(resolvedData => Joi.object(departmentsResponseSchema).validateAsync({departments: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.getDepartment = (req, res, next) => {
    fetchDepartment(req.params)
        .then(resolvedData => Joi.object(departmentResponseSchema).validateAsync({department: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.patchDepartment = (req, res, next) => {
    updateDepartment(req.params, req.body)
        .then(resolvedData => Joi.object(departmentResponseSchema).validateAsync({department: resolvedData}))
        .then(validatedData => res.status(200).json(validatedData))
        .catch(next);
};

exports.deleteDepartment = (req, res, next) => {
    removeDepartment(req.params).then(res.status(204).json({})).catch(next);
};

exports.postDepartment = (req, res, next) => {
    addDepartment(req.body)
        .then(resolvedData => Joi.object(departmentResponseSchema).validateAsync({department: resolvedData}))
        .then(validatedData => res.status(201).json(validatedData))
        .catch(next);
};
