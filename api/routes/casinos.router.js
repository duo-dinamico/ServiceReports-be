const casinosRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {casinosSchema} = require("../schemas/casinos");
const {getAllCasinos} = require("../controllers/casinos.controllers");
const {methodNotAllowed} = require("../errors");

casinosRouter.route("/").get(celebrate(casinosSchema), getAllCasinos).all(methodNotAllowed);

module.exports = casinosRouter;

/**
 * @swagger
 * tags:
 *   name: Casinos
 *   description: Casino management and retrieval
 */

/**
 * @swagger
 * /casinos:
 *  get:
 *    summary: Use to request all casinos
 *    tags: [Casinos]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/casino_id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
