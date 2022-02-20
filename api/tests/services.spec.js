const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = [
    "id",
    "user",
    "department",
    "created_at",
    "updated_at",
    "closed_at",
    "deleted_at",
    "created_by",
    "updated_by",
    "closed_by",
    "deleted_by",
];
const urlPath = "/api/services";
const invalidMethods = ["post", "put", "patch", "delete"];

const departmentId = "1ed90dca-dd68-476a-bd48-63b2a5d66c2f";
const userId = "435ccd69-f989-4219-a3c7-9f09ff32c6cb";
const createdBy = "9a5c5991-a14d-4d85-b75f-d75081500c8d";
const closedBy = "435ccd69-f989-4219-a3c7-9f09ff32c6cb";

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/services", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("Sortable", () => {
                it("status: 200, sortable by name", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "created_at"})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toBeSorted({key: "created_at"});
                        }));
                it("status: 200, sortable by name desc", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "created_at", order: "desc"})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toBeSorted({key: "created_at", descending: true});
                        }));
            });
            describe("Queries", () => {
                it("status: 200, filter by department id", () =>
                    request
                        .get(urlPath)
                        .query({department_id: departmentId})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toHaveLength(1);
                            const [service] = services;
                            expect(service).toHaveProperty("department.id", departmentId);
                        }));
                it("status: 200, filter by user id", () =>
                    request
                        .get(urlPath)
                        .query({user_id: userId})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toHaveLength(2);
                            const [service] = services;
                            expect(service).toHaveProperty("user.id", userId);
                        }));
                it("status: 200, filter by created by", () =>
                    request
                        .get(urlPath)
                        .query({created_by: createdBy})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toHaveLength(1);
                            const [service] = services;
                            expect(service).toHaveProperty("created_by", createdBy);
                        }));
                it("status: 200, filter by closed by", () =>
                    request
                        .get(urlPath)
                        .query({closed_by: closedBy})
                        .expect(200)
                        .then(({body: {services}}) => {
                            expect(services).toHaveLength(1);
                            const [service] = services;
                            expect(service).toHaveProperty("closed_by", closedBy);
                        }));
            });
            it("status: 200", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {services}}) => {
                        expect(services).not.toBe(null);
                        expect(Array.isArray(services)).toBe(true);
                    }));
            it("status: 200, with expected keys", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {services}}) => {
                        services.forEach(service => {
                            expect(Object.keys(service)).toEqual(expectedKeys);
                        });
                    }));
            it("status: 200, no deleted services", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {services}}) => {
                        services.forEach(service => {
                            expect(service.deleted_at).toBe(null);
                        });
                    }));
            it("status: 200, no deleted users", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {services}}) => {
                        services.forEach(service => {
                            expect(service.user.id).not.toEqual("d3b77da1-f9a3-4b1b-b747-7a7cb27efe75");
                        });
                    }));
        });
        describe("ERROR HANDLING", () => {
            describe("Sortable", () => {
                it("status: 400, sortable by valid option", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "invalid"})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe('"sort_by" must be [created_at]');
                        }));
                it("status: 400, order by valid option", () =>
                    request
                        .get(urlPath)
                        .query({order: "invalid"})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe('"order" must be one of [asc, desc]');
                        }));
            });
            describe("Queries", () => {
                it.each(["department_id", "user_id", "created_by", "closed_by"])(
                    "status: 400, %s must contain a valid GUID",
                    async queryId =>
                        request
                            .get(urlPath)
                            .query({[queryId]: "invalid"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe(`"${[queryId]}" must be a valid GUID`);
                            })
                );
            });
            it.each(invalidMethods)("status:405, invalid method - %s", async method =>
                request[method](urlPath)
                    .expect(405)
                    .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
            );
        });
    });
});
