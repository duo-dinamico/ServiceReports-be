const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "name", "created_at", "updated_at", "deleted_at", "client"];
const urlPath = "/api/departments";
const invalidMethods = ["put", "patch", "delete"];
const invalidMethodsId = ["post", "put"];

const departmentId = "a7895b03-70a2-4bab-8e0f-dbc561e6d098";
const clientId = "4dca6671-7c73-4414-bf4c-0646d8c70ede";
const patchBody = {name: "Test Department", client_id: "4dca6671-7c73-4414-bf4c-0646d8c70ede"};
const postBody = {name: "New Department", client_id: "583eed9c-65d0-4d3e-b561-faba91ca0ee5"};

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/departments", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
                describe("Sortable", () => {
                    it("status: 200, sortable by name", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name"})
                            .expect(200)
                            .then(({body: {departments}}) => {
                                expect(departments).toBeSorted({key: "name"});
                            }));
                    it("status: 200, sortable by name desc", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name", order: "desc"})
                            .expect(200)
                            .then(({body: {departments}}) => {
                                expect(departments).toBeSorted({key: "name", descending: true});
                            }));
                });
                describe("Queries", () => {
                    it("status: 200, filter by department id", () =>
                        request
                            .get(urlPath)
                            .query({department_id: departmentId})
                            .expect(200)
                            .then(({body: {departments}}) => {
                                expect(departments).toHaveLength(1);
                                const [department] = departments;
                                expect(department).toHaveProperty("id", departmentId);
                            }));
                    it("status: 200, filter by client id", () =>
                        request
                            .get(urlPath)
                            .query({client_id: clientId})
                            .expect(200)
                            .then(({body: {departments}}) => {
                                expect(departments).toHaveLength(3);
                                departments.forEach(department => {
                                    expect(department).toHaveProperty("client.id", clientId);
                                });
                            }));
                });
                it("status: 200", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {departments}}) => {
                            expect(departments).not.toBe(null);
                            expect(Array.isArray(departments)).toBe(true);
                        }));
                it("status: 200, with expected keys", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {departments}}) => {
                            departments.forEach(department => {
                                expect(Object.keys(department)).toEqual(expectedKeys);
                            });
                        }));
                it("status: 200, no deleted departments", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {departments}}) => {
                            departments.forEach(department => {
                                expect(department.deleted_at).toBe(null);
                            });
                        }));
                it("status: 200, no deleted clients", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {departments}}) => {
                            departments.forEach(department => {
                                expect(department.client.id).not.toEqual("30d877ce-387c-4b9d-8a58-566a035892d0");
                            });
                        }));
            });
            describe("POST", () => {
                it("status: 201, must get succesful status", () => request.post(urlPath).send(postBody).expect(201));
                it("status: 201, returns expected keys for department", () =>
                    request
                        .post(urlPath)
                        .send(postBody)
                        .expect(201)
                        .then(({body: {department}}) => {
                            expect(department).not.toBe(null);
                            expect(typeof department === "object" && department.constructor === Object).toBeTruthy();
                            expect(Object.keys(department)).toEqual(expectedKeys);
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
                                expect(message).toBe('"sort_by" must be [name]');
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
                    it("status: 400, department id must contain a valid GUID", () =>
                        request
                            .get(urlPath)
                            .query({department_id: "invalid"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"department_id" must be a valid GUID');
                            }));
                    it("status: 400, client id must contain a valid GUID", () =>
                        request
                            .get(urlPath)
                            .query({client_id: "invalid"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"client_id" must be a valid GUID');
                            }));
                    it("status: 400, client id must exist", () =>
                        request
                            .get(urlPath)
                            .query({client_id: "4dca6671-7c73-4414-bf4c-0646d8c70ed0"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"4dca6671-7c73-4414-bf4c-0646d8c70ed0" could not be found');
                            }));
                });
            });
            describe("POST", () => {
                it("status: 400, should have required keys", () =>
                    request
                        .post(urlPath)
                        .send({name: postBody.name})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"client_id" is required');
                        }));
                it("status: 400, values should be strings", () =>
                    request
                        .post(urlPath)
                        .send({name: 12345})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"name" must be a string');
                        }));
                it("status: 400, department should be unique [name must be unique]", () =>
                    request
                        .post(urlPath)
                        .send({name: "Heating at Royal Gas", client_id: postBody.client_id})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"Heating at Royal Gas" already exists');
                        }));
                it("status: 400, should only have allowed keys", () =>
                    request
                        .post(urlPath)
                        .send({...postBody, batatas: "fritas"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"batatas" is not allowed');
                        }));
                it("status: 404, client must exist", () =>
                    request
                        .post(urlPath)
                        .send({name: "New Department", client_id: "4dca6671-7c73-4414-bf4c-0646d8c70edf"})
                        .expect(404)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Not Found");
                            expect(message).toBe('"4dca6671-7c73-4414-bf4c-0646d8c70edf" could not be found');
                        }));
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
                    it("status: 200", () => request.get(`${urlPath}/${departmentId}`).expect(200));
                    it("status: 200, should return an object", () =>
                        request
                            .get(`${urlPath}/${departmentId}`)
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(department).not.toBe(null);
                                expect(
                                    typeof department === "object" && department.constructor === Object
                                ).toBeTruthy();
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .get(`${urlPath}/${departmentId}`)
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(Object.keys(department)).toEqual(expectedKeys);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 200, should be able to patch a department", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send(patchBody)
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(department.id).toBe(departmentId);
                                expect(department.name).toBe(patchBody.name);
                                expect(department.client.id).toBe(patchBody.client_id);
                            }));
                    it("status: 200, should be able to patch only department name", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({name: patchBody.name})
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(department.id).toBe(departmentId);
                                expect(department.name).toBe(patchBody.name);
                            }));
                    it("status: 200, should be able to patch only department client", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({client_id: patchBody.client_id})
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(department.id).toBe(departmentId);
                                expect(department.client.id).toBe(patchBody.client_id);
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send(patchBody)
                            .expect(200)
                            .then(({body: {department}}) => {
                                expect(Object.keys(department)).toEqual(expectedKeys);
                            }));
                });
                describe("DELETE", () => {
                    it("status: 204, should be able to soft delete a department", () =>
                        request.delete(`${urlPath}/${departmentId}`).expect(204));
                    it("status: 204, should return empty object", () =>
                        request
                            .delete(`${urlPath}/${departmentId}`)
                            .expect(204)
                            .then(({body}) => {
                                expect(body).toStrictEqual({});
                            }));
                    it("status: 204, confirm that department has been soft deleted", () =>
                        request
                            .delete(`${urlPath}/${departmentId}`)
                            .expect(204)
                            .then(() =>
                                request
                                    .get(urlPath)
                                    .expect(200)
                                    .then(({body: {departments}}) => {
                                        departments.forEach(department => {
                                            expect(department.id).not.toEqual(departmentId);
                                        });
                                    })
                            ));
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
                            .get(`${urlPath}/a7895b03-70a2-4bab-8e0f-dbc561e6d099`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"a7895b03-70a2-4bab-8e0f-dbc561e6d099" could not be found`);
                            }));
                    it("status: 404, should not return a department that has been deleted", () =>
                        request
                            .get(`${urlPath}/329adfd4-9880-49ee-b650-af3f24dc4929`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"329adfd4-9880-49ee-b650-af3f24dc4929" could not be found`);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 400, empty body not allowed", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"value" must have at least 1 key');
                            }));
                    it("status: 400, keys must be name or client_id", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({fake_key: "the only key for you"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"fake_key" is not allowed');
                            }));
                    it("status: 400, name must be string", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({name: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"name" must be a string');
                            }));
                    it("status: 400, client_id must be string and of type UUID", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({client_id: "not a good string"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"client_id" must be a valid GUID');
                            }));
                    it("status: 400, name should be unique", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({name: "Ventilation Department at Clarks"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"Ventilation Department at Clarks" already exists');
                            }));
                    it("status: 404, client must exist", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({client_id: "4dca6671-7c73-4414-bf4c-0646d8c70edd"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"4dca6671-7c73-4414-bf4c-0646d8c70edd" could not be found');
                            }));
                    it("status: 404, client must not be deleted", () =>
                        request
                            .patch(`${urlPath}/${departmentId}`)
                            .send({client_id: "30d877ce-387c-4b9d-8a58-566a035892d0"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"30d877ce-387c-4b9d-8a58-566a035892d0" could not be found');
                            }));
                });
                describe("DELETE", () => {
                    it("status: 404, should error if department not found", () =>
                        request
                            .delete(`${urlPath}/341ae597-6e26-4c2a-9966-26447522a21d`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"341ae597-6e26-4c2a-9966-26447522a21d" could not be found`);
                            }));
                    it("status: 404, should error if already deleted", () =>
                        request
                            .delete(`${urlPath}/329adfd4-9880-49ee-b650-af3f24dc4929`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"329adfd4-9880-49ee-b650-af3f24dc4929" could not be found`);
                            }));
                    it("status: 400, should error if not UUID", () =>
                        request
                            .delete(`${urlPath}/invalid`)
                            .expect(400)
                            .then(({body: {message}}) => {
                                expect(message).toBe('"id" must be a valid GUID');
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
