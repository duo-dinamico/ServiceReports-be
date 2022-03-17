const clientsRouter = require("express").Router();
const {celebrate} = require("celebrate");

const {clientsSchema, clientSchema, postClientSchema, patchClientSchema} = require("../schemas/clients");
const {getAllClients, getClient, deleteClient, postClient, patchClient} = require("../controllers/clients.controllers");
const {methodNotAllowed} = require("../errors");
const {validateClientExists} = require("../validation/clients.validation");

clientsRouter
    .route("/")
    .get(celebrate(clientsSchema), getAllClients)
    .post(celebrate(postClientSchema), validateClientExists, postClient)
    .all(methodNotAllowed);
clientsRouter
    .route("/:id")
    .get(celebrate(clientSchema), validateClientExists, getClient)
    .patch(celebrate(patchClientSchema), validateClientExists, patchClient)
    .delete(celebrate(clientSchema), validateClientExists, deleteClient)
    .all(methodNotAllowed);

module.exports = clientsRouter;

/**
 * @openapi
 * tags:
 *   name: Clients
 *   description: Client management and retrieval
 */

/**
 * @openapi
 * /clients:
 *  get:
 *    summary: Use to request all clients
 *    tags: [Clients]
 *    parameters:
 *      - $ref: '#parameters/sort_by'
 *      - $ref: '#parameters/order'
 *      - $ref: '#parameters/client_id'
 *    responses:
 *      '200':
 *        description: Returns an object with an array of client objects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/clients_schema'
 *      '400':
 *        description: Bad request
 *
 *  post:
 *    summary: Use to add a client
 *    tags: [Clients]
 *    requestBody:
 *      description: Body to add a client
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: client de Test
 *              location:
 *                type: string
 *                example: testname
 *    responses:
 *      '201':
 *        description: Returns an object with a client object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                client:
 *                  oneOf:
 *                  $ref: '#/components/schemas/client_schema'
 *      '400':
 *        description: Bad request.
 */

/**
 * @openapi
 * /clients/{id}:
 *  get:
 *    summary: Use to request a client
 *    tags: [Clients]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    responses:
 *      '200':
 *        description: Returns an object with a key "client", with a client object
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/client_schema'
 *      '400':
 *        description: Bad request
 *
 *  patch:
 *    summary: Use to edit a client
 *    tags: [Clients]
 *    parameters:
 *      - $ref: '#parameters/id'
 *    requestBody:
 *      description: Body to edit a client
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: client de Teste
 *              location:
 *                type: string
 *                example: Location name
 *    responses:
 *      '200':
 *        description: Returns an object with a client object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                client:
 *                  oneOf:
 *                  $ref: '#/components/schemas/client_schema'
 *      '400':
 *        description: Bad request.
 *
 *  delete:
 *    summary: Use to delete one client
 *    tags: [Clients]
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
 *    client_schema:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        name:
 *          type: string
 *        location:
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
 *    clients_schema:
 *      type: object
 *      properties:
 *        clients:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/client_schema'
 */
