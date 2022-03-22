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
 *        description: Returns an object with a key "clients", with an array of client objects
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/clients_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
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
 *                example: Test Client
 *              location:
 *                type: string
 *                example: Client location
 *    responses:
 *      '201':
 *        description: Returns an object with a client object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/client_id_schema'
 *      '400':
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/bad_request_schema'
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
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/client_id_schema'
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
 *                example: Test Client
 *              location:
 *                type: string
 *                example: Client location name
 *    responses:
 *      '200':
 *        description: Returns an object with a key "client", with a client object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/client_id_schema'
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
 *  delete:
 *    summary: Use to delete a client
 *    tags: [Clients]
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
 *    client_id_schema:
 *      type: object
 *      properties:
 *        client:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/client_schema'
 *    clients_schema:
 *      type: object
 *      properties:
 *        clients:
 *          type: array
 *          items:
 *            type: object
 *            allOf:
 *              - $ref: '#/components/schemas/client_schema'
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
