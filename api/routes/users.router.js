const usersRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {usersSchema} = require("../schemas/users");
const {getAllUsers} = require("../controllers/users.controllers");
const {methodNotAllowed} = require("../errors");

usersRouter.route("/").get(celebrate(usersSchema), getAllUsers).all(methodNotAllowed);

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
 */
