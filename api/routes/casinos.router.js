const casinosRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {casinosSchema, casinoSchema} = require("../schemas/casinos");
const {getAllCasinos, getCasino, deleteCasino} = require("../controllers/casinos.controllers");
const {methodNotAllowed} = require("../errors");
const {validateCasinoExists} = require("../validation/casinos.validation");

casinosRouter.route("/").get(celebrate(casinosSchema), getAllCasinos).all(methodNotAllowed);
casinosRouter
    .route("/:id")
    .get(celebrate(casinoSchema), validateCasinoExists, getCasino)
    .delete(celebrate(casinoSchema), validateCasinoExists, deleteCasino)
    .all(methodNotAllowed);

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
 *        description: Returns an object with an array of casino objects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/casinos_schema'
 *      '400':
 *        description: Bad request
 *
 * /casinos/{id}:
 *  get:
 *    summary: Use to request a casino
 *    tags: [Casinos]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "casino", with a casino object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/casino_schema'
 *      '400':
 *        description: Bad request
 *
 *  delete:
 *    summary: Use to delete one casino
 *    tags: [Casinos]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '204':
 *        description: A successful response, returns an empty object
 *      '400':
 *        description: Bad request
 *      '404':
 *        description: Not Found
 *
 * components:
 *  schemas:
 *    casino_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        location:
 *          type: string
 *        created_at:
 *          type: string
 *        updated_at:
 *          type: string
 *        deleted_at:
 *          type: string
 *    casinos_schema:
 *      type: object
 *      properties:
 *        casinos:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/casino_schema'
 */
