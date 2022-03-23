const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = [
    "id",
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
const invalidMethodsId = ["post", "put", "delete"];
const departmentId = "1ed90dca-dd68-476a-bd48-63b2a5d66c2f";
const createdBy = "9a5c5991-a14d-4d85-b75f-d75081500c8d";
const closedBy = "435ccd69-f989-4219-a3c7-9f09ff32c6cb";
const serviceId = "435fc172-dff3-4294-ab7b-7e929d00aa44";
const patchBody = {
    machine_id: "f8cae396-5376-47ae-8dfc-690572e76a09",
};

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/services", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
                describe("Sortable", () => {
                    it("status: 200, sortable by created_at", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "created_at"})
                            .expect(200)
                            .then(({body: {services}}) => {
                                expect(services).toBeSorted({key: "created_at"});
                            }));
                    it("status: 200, sortable by created_at desc", () =>
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
                    it("status: 200, filter by created by", () =>
                        request
                            .get(urlPath)
                            .query({created_by: createdBy})
                            .expect(200)
                            .then(({body: {services}}) => {
                                expect(services).toHaveLength(1);
                                const [service] = services;
                                expect(service).toHaveProperty("created_by.id", createdBy);
                            }));
                    it("status: 200, filter by closed by", () =>
                        request
                            .get(urlPath)
                            .query({closed_by: closedBy})
                            .expect(200)
                            .then(({body: {services}}) => {
                                expect(services).toHaveLength(1);
                                const [service] = services;
                                expect(service).toHaveProperty("closed_by.id", closedBy);
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
            });
        });
        describe("ERROR HANDLING", () => {
            describe("GET", () => {
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
                    it.each(["department_id", "created_by", "closed_by"])(
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
            });
            it.each(invalidMethods)("status:405, invalid method - %s", async method =>
                request[method](urlPath)
                    .expect(405)
                    .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
            );
        });
        describe("/:id", () => {
            describe("DEFAULT BEHAVIOUR", () => {
                describe("GET", () => {
                    it("status: 200", () => request.get(`${urlPath}/${serviceId}`).expect(200));
                    it("status: 200, should return an object", () =>
                        request
                            .get(`${urlPath}/${serviceId}`)
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(service).not.toBe(null);
                                expect(typeof service === "object" && service.constructor === Object).toBeTruthy();
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .get(`${urlPath}/${serviceId}`)
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(Object.keys(service)).toEqual(expectedKeys);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 200, should be able to patch a service", () => {
                        const patchService = {
                            ...patchBody,
                            maintaned: true,
                            repaired: true,
                            operational: false,
                            comments: "Esta maquina esta como nova",
                        };
                        return request
                            .patch(`${urlPath}/${serviceId}`)
                            .send(patchService)
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(service.id).toBe(serviceId);
                            });
                    });
                    it("status: 200, should be able to patch only service department", () =>
                        request
                            .patch(`${urlPath}/${serviceId}`)
                            .send({department_id: patchBody.department_id})
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(service.id).toBe(serviceId);
                                expect(service.department.id).toBe(patchBody.department_id);
                            }));
                    it("status: 200, should be able to patch only service manufacturer", () =>
                        request
                            .patch(`${urlPath}/${serviceId}`)
                            .send({manufacturer: patchBody.manufacturer})
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(service.id).toBe(serviceId);
                                expect(service.manufacturer).toBe(patchBody.manufacturer);
                            }));
                    it("status: 200, should be able to patch only service model", () =>
                        request
                            .patch(`${urlPath}/${serviceId}`)
                            .send({model: patchBody.model})
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(service.id).toBe(serviceId);
                                expect(service.model).toBe(patchBody.model);
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .patch(`${urlPath}/${serviceId}`)
                            .send(patchBody)
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(Object.keys(service)).toEqual(expectedKeys);
                            }));
                });
            });
            describe("ERROR HANDLING", () => {
                describe("GET", () => {
                    it("status: 400, should error if id not uuid", () =>
                        request
                            .get(`${urlPath}/invalid`)
                            .expect(400)
                            .then(({body: {message}}) => {
                                expect(message).toBe('"id" must be a valid GUID');
                            }));
                    it("status: 404, should error if id doesn't exist", () =>
                        request
                            .get(`${urlPath}/48e01a0d-3e9a-4568-bb47-368c13ed3f4e`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"48e01a0d-3e9a-4568-bb47-368c13ed3f4e" could not be found`);
                            }));
                    it("status: 404, should not return a service that has been deleted", () =>
                        request
                            .get(`${urlPath}/48e01a0d-3e9a-4568-bb47-368c13ed3f4d`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"48e01a0d-3e9a-4568-bb47-368c13ed3f4d" could not be found`);
                            }));
                });
                it.each(invalidMethodsId)("status:405, invalid method - %s", async method =>
                    request[method](`${urlPath}/${departmentId}`)
                        .expect(405)
                        .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                );
            });
        });
    });
});
