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
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Use to request all users
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/user_id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
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
 *                example: testusername
 *              name:
 *                type: string
 *                example: testname
 *    responses:
 *      '201':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 *
 *
 * /users/{id}:
 *  get:
 *    summary: Use to request one user
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 *  patch:
 *    summary: Use to patch one user
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 *    requestBody:
 *      description: Body to update a user
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: testusername
 *                name:
 *                  type: string
 *                  example: testname
 *  delete:
 *    summary: Use to delete one users
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '204':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
