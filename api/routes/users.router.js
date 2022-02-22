const usersRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {usersSchema, userSchema} = require("../schemas/users");
const {getAllUsers, deleteUser, getUser} = require("../controllers/users.controllers");
const {validateDeleteUser} = require("../validation/users.validation");
const {methodNotAllowed} = require("../errors");

usersRouter.route("/").get(celebrate(usersSchema), getAllUsers).all(methodNotAllowed);
usersRouter
    .route("/:id")
    .get(celebrate(userSchema), getUser)
    .delete(celebrate(userSchema), validateDeleteUser, deleteUser)
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
 *  delete:
 *    summary: Use to delete one users
 *    tags: [Users]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
