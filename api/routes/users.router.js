const usersRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {usersSchema, userSchema, patchUserSchema, postUserSchema} = require("../schemas/users");
const {getAllUsers, deleteUser, getUser, patchUser, postUser} = require("../controllers/users.controllers");
const {validateUserExists} = require("../validation/users.validation");
const {methodNotAllowed} = require("../errors");

usersRouter
    .route("/")
    .get(celebrate(usersSchema), getAllUsers)
    .post(celebrate(postUserSchema), validateUserExists, postUser)
    .all(methodNotAllowed);
usersRouter
    .route("/:id")
    .get(celebrate(userSchema), getUser)
    .patch(celebrate(patchUserSchema), validateUserExists, patchUser)
    .delete(celebrate(userSchema), validateUserExists, deleteUser)
    .all(methodNotAllowed);

module.exports = usersRouter;

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @openapi
 * /users:
 *  get:
 *    summary: Use to request all users
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/user_id'
 *    responses:
 *      200:
 *         description: Returns an object with an array of users objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
 *  post:
 *    summary: Use to add a user
 *    tags: [Users]
 *    requestBody:
 *      description: Body to add a user
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: jdoe
 *              name:
 *                type: string
 *                example: John Doe
 *    responses:
 *      '201':
 *        description: Returns an object with a user object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/machine_schema'
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
 * /users/{id}:
 *  get:
 *    summary: Use to request a user
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "user", with a user object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user_schema'
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
 *    summary: Use to update a user
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    requestBody:
 *      description: Body to add a user
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: jdoe
 *              name:
 *                type: string
 *                example: John Doe
 *    responses:
 *      '200':
 *        description: Returns an object with a key "user", with a user object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user_schema'
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
 *    summary: Use to delete a user
 *    tags: [Users]
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
 *    user_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        username:
 *          type: string
 *        name:
 *          type: string
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        deleted_at:
 *          type: string
 *          format: date-time
 *    users_schema:
 *      type: object
 *      properties:
 *        users:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/user_schema'
 *    not_found_schema:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: integer
 *          example: 404
 *        error:
 *          type: string
 *          example: Not Found
 *        message:
 *          type: string
 *          example: '"id" could not be found'
 *    bad_request_schema:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: integer
 *          example: 400
 *        error:
 *          type: string
 *          example: Bad Request
 *        message:
 *          type: string
 *          example: '"id" must be a valid GUID'
 */
