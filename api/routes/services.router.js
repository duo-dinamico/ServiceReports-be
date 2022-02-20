const servicesRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {servicesSchema} = require("../schemas/services");
const {getAllServices} = require("../controllers/services.controllers");
const {methodNotAllowed} = require("../errors");

servicesRouter.route("/").get(celebrate(servicesSchema), getAllServices).all(methodNotAllowed);

module.exports = servicesRouter;

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Department management and retrieval
 */

/**
 * @swagger
 * /services:
 *  get:
 *    summary: Use to request all services
 *    tags: [Services]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/department_id'
 *      - $ref: '#parameters/user_id'
 *      - $ref: '#parameters/created_by'
 *      - $ref: '#parameters/closed_by'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
