const machinesRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {machinesSchema} = require("../schemas/machines");
const {getAllMachines} = require("../controllers/machines.controllers");
const {methodNotAllowed} = require("../errors");

machinesRouter.route("/").get(celebrate(machinesSchema), getAllMachines).all(methodNotAllowed);

module.exports = machinesRouter;

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Machine management and retrieval
 */

/**
 * @swagger
 * /machines:
 *  get:
 *    summary: Use to request all machines
 *    tags: [Machines]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/machine_id'
 *      - $ref: '#parameters/manufacturer'
 *      - $ref: '#parameters/model'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
