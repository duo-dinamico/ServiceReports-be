const casinosRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {casinosSchema, casinoSchema} = require("../schemas/casinos");
const {getAllCasinos, getCasino} = require("../controllers/casinos.controllers");
const {methodNotAllowed} = require("../errors");
const {validateCasinoExists} = require("../validation/casinos.validation");

casinosRouter.route("/").get(celebrate(casinosSchema), getAllCasinos).all(methodNotAllowed);
casinosRouter.route("/:id").get(celebrate(casinoSchema), validateCasinoExists, getCasino);

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
 *
 * /casinos/{id}:
 *  get:
 *    summary: Use to request a casino
 *    tags: [Casinos]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request.
 */
