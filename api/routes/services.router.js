const servicesRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {servicesSchema} = require("../schemas/services");
const {getAllServices} = require("../controllers/services.controllers");
const {methodNotAllowed} = require("../errors");

servicesRouter.route("/").get(celebrate(servicesSchema), getAllServices).all(methodNotAllowed);

module.exports = servicesRouter;

/**
 * @openapi
 * tags:
 *   name: Services
 *   description: Department management and retrieval
 */

/**
 * @openapi
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
 *      200:
 *         description: Returns an object with a key "services", with an array of service objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/services_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    service_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        user:
 *          type: object
 *          allOf:
 *            - $ref: '#/components/schemas/user_schema'
 *        department:
 *          type: object
 *          allOf:
 *            - $ref: '#/components/schemas/department_schema'
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        closed_at:
 *          type: string
 *          format: date-time
 *        deleted_at:
 *          type: string
 *          format: date-time
 *        created_by:
 *          type: string
 *          format: uuid
 *        updated_by:
 *          type: string
 *          format: uuid
 *        closed_by:
 *          type: string
 *          format: uuid
 *        deleted_by:
 *          type: string
 *          format: uuid
 *    service_id_schema:
 *      type: object
 *      properties:
 *        service:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/service_schema'
 *    services_schema:
 *      type: object
 *      properties:
 *        services:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/service_schema'
 */
