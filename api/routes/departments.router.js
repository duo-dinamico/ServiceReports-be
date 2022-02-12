const departmentsRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {departmentsSchema} = require("../schemas/departments");
const {getAllDepartments} = require("../controllers/departments.controllers");
const {methodNotAllowed} = require("../errors");

departmentsRouter.route("/").get(celebrate(departmentsSchema), getAllDepartments).all(methodNotAllowed);

module.exports = departmentsRouter;

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management and retrieval
 */

/**
 * @swagger
 * /departments:
 *  get:
 *    summary: Use to request all departments
 *    tags: [Departments]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/department_id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
