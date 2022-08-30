const departmentsRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {
    departmentsSchema,
    departmentSchema,
    patchDepartmentSchema,
    postDepartmentSchema,
} = require("../schemas/departments");
const {
    getAllDepartments,
    getDepartment,
    patchDepartment,
    deleteDepartment,
    postDepartment,
} = require("../controllers/departments.controllers");
const {methodNotAllowed} = require("../errors");
const {validateDepartmentExists} = require("../validation/departments.validation");

departmentsRouter
    .route("/")
    .get(celebrate(departmentsSchema), getAllDepartments)
    .post(celebrate(postDepartmentSchema), validateDepartmentExists, postDepartment)
    .all(methodNotAllowed);
departmentsRouter
    .route("/:id")
    .get(celebrate(departmentSchema), getDepartment)
    .patch(celebrate(patchDepartmentSchema), validateDepartmentExists, patchDepartment)
    .delete(celebrate(departmentSchema), validateDepartmentExists, deleteDepartment)
    .all(methodNotAllowed);

module.exports = departmentsRouter;

/**
 * @openapi
 * tags:
 *   name: Departments
 *   description: Department management and retrieval
 */

/**
 * @openapi
 * /departments:
 *  get:
 *    summary: Use to request all departments
 *    tags: [Departments]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/department_id'
 *      - $ref: '#parameters/client_id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "departments", with an array of department objects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/departments_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *
 *  post:
 *    summary: Use to add a department
 *    tags: [Departments]
 *    requestBody:
 *      description: Body to add a department
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: New Department
 *              client_id:
 *                type: string
 *                format: uuid
 *                example: 4dca6671-7c73-4414-bf4c-0646d8c70ede
 *    responses:
 *      '201':
 *        description: Returns an object with a key "department", with a department object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/department_id_schema'
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
 * /departments/{id}:
 *  get:
 *    summary: Use to request a department
 *    tags: [Departments]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "department", with a department object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/department_id_schema'
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
 *
 *  patch:
 *    summary: Use to update a department
 *    tags: [Departments]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    requestBody:
 *      description: Body to edit a department
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Test Department
 *              client_id:
 *                type: string
 *                format: uuid
 *                example: 4dca6671-7c73-4414-bf4c-0646d8c70ede
 *    responses:
 *      '200':
 *        description: Returns an object with a key "department", with a department object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/department_id_schema'
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
 *    summary: Use to delete a department
 *    tags: [Departments]
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
 * components:
 *  schemas:
 *    department_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        client:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *            name:
 *              type: string
 *            location:
 *              type: string
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        deleted_at:
 *          type: string
 *          format: date-time
 *    department_id_schema:
 *      type: object
 *      properties:
 *        department:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/department_schema'
 *    departments_schema:
 *      type: object
 *      properties:
 *        departments:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/department_schema'
 */
