const servicesRouter = require("express").Router({
    mergeParams: true,
});
const {celebrate} = require("celebrate");

const {
    servicesSchema,
    serviceSchema,
    patchServiceSchema,
    patchMachineRevisionSchema,
    postServiceSchema,
} = require("../schemas/services");
const {
    getAllServices,
    getService,
    patchService,
    patchMachineRevision,
    deleteService,
    postService,
} = require("../controllers/services.controllers");
const {methodNotAllowed} = require("../errors");
const {validateServiceExists} = require("../validation/services.validation");

servicesRouter
    .route("/")
    .get(celebrate(servicesSchema), getAllServices)
    .post(celebrate(postServiceSchema), validateServiceExists, postService)
    .all(methodNotAllowed);
servicesRouter
    .route("/:service_id")
    .get(celebrate(serviceSchema), getService)
    .patch(celebrate(patchServiceSchema), validateServiceExists, patchService)
    .delete(celebrate(serviceSchema), validateServiceExists, deleteService)
    .all(methodNotAllowed);
servicesRouter
    .route("/:service_id/machine/:machine_id")
    .patch(celebrate(patchMachineRevisionSchema), validateServiceExists, patchMachineRevision)
    .all(methodNotAllowed);

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
 *      - $ref: '#parameters/show_deleted'
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
 *  post:
 *    summary: Use to add a service
 *    tags: [Services]
 *    requestBody:
 *      description: Body to add a service
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: string
 *                format: uuid
 *                example: 435ccd69-f989-4219-a3c7-9f09ff32c6cb
 *              department_id:
 *                type: string
 *                format: uuid
 *                example: a7895b03-70a2-4bab-8e0f-dbc561e6d098
 *    responses:
 *      '201':
 *        description: Returns an object with a key "service", with a service object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/service_id_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *      '404':
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/not_found_schema'
 */

/**
 * @openapi
 * /services/{id}:
 *  get:
 *    summary: Use to request a service
 *    tags: [Services]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "service", with a service object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/service_id_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *      '404':
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/not_found_schema'
 *  patch:
 *    summary: Use to update a service
 *    tags: [Services]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    requestBody:
 *      description: Body to add a service
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: string
 *                format: uuid
 *                example: 435ccd69-f989-4219-a3c7-9f09ff32c6cb
 *              closed:
 *                type: boolean
 *                example: false
 *    responses:
 *      '200':
 *        description: Returns an object with a key "service", with a service object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/service_id_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *      '404':
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/not_found_schema'
 *  delete:
 *    summary: Use to delete a service
 *    tags: [Services]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '204':
 *        description: Returns an empty object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *      '404':
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/not_found_schema'
 */

/**
 * @openapi
 * /services/{service_id_path}/machine/{machine_id_path}:
 *  patch:
 *    summary: Use to update a service's revision
 *    tags: [Services]
 *    parameters:
 *      - $ref: '#parameters/service_id_path'
 *      - $ref: '#parameters/machine_id_path'
 *    requestBody:
 *      description: Body to add a service
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: string
 *                format: uuid
 *                example: 435ccd69-f989-4219-a3c7-9f09ff32c6cb
 *              maintained:
 *                type: boolean
 *                example: false
 *              repaired:
 *                type: boolean
 *                example: false
 *              operational:
 *                type: boolean
 *                example: false
 *              comments:
 *                type: string
 *                maxLength: 255
 *                example: This machine is fully operational
 *    responses:
 *      '200':
 *        description: Returns an object with a key "service", with a service object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/service_id_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *      '404':
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/not_found_schema'
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
