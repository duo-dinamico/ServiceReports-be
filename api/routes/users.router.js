const usersRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {usersSchema} = require("../schemas/users");
const {getAllUsers} = require("../controllers/users.controllers");
const {methodNotAllowed} = require("../errors");

/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
usersRouter.route("/").get(celebrate(usersSchema), getAllUsers).all(methodNotAllowed);

module.exports = usersRouter;
