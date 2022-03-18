const machinesRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {machinesSchema, machineSchema, patchMachineSchema, postMachineSchema} = require("../schemas/machines");
const {
    getAllMachines,
    getMachine,
    patchDepartment,
    deleteMachine,
    postMachine,
} = require("../controllers/machines.controllers");
const {methodNotAllowed} = require("../errors");
const {validateMachineExists} = require("../validation/machines.validation");

machinesRouter
    .route("/")
    .get(celebrate(machinesSchema), getAllMachines)
    .post(celebrate(postMachineSchema), validateMachineExists, postMachine)
    .all(methodNotAllowed);
machinesRouter
    .route("/:id")
    .get(celebrate(machineSchema), getMachine)
    .patch(celebrate(patchMachineSchema), validateMachineExists, patchDepartment)
    .delete(celebrate(machineSchema), validateMachineExists, deleteMachine)
    .all(methodNotAllowed);

module.exports = machinesRouter;

/**
 * @openapi
 * tags:
 *   name: Machines
 *   description: Machine management and retrieval
 */

/**
 * @openapi
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
 *        description: Returns an object with an array of machine objects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/machines_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: integer
 *                  example: 400
 *                error:
 *                  type: string
 *                  example: Bad Request
 *                message:
 *                  type: string
 *                  example: '"id" must be a valid GUID'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    machine_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        manufacturer:
 *          type: string
 *        model:
 *          type: string
 *        serial_number:
 *          type: string
 *        department:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *            name:
 *              type: string
 *            casino:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  format: uuid
 *                name:
 *                  type: string
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        deleted_at:
 *          type: string
 *          format: date-time
 *    machines_schema:
 *      type: object
 *      properties:
 *        machines:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/machine_schema'
 */
