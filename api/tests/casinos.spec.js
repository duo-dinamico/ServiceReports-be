const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "name", "location", "created_at", "updated_at", "deleted_at"];
const urlPath = "/api/casinos";
const invalidMethods = ["put", "patch", "delete"];
const invalidMethodsId = ["post", "put", "patch"];
const casinoId = "446470f4-aeff-4fb7-9b53-38b434ca2488";
const casinoIdDelete = "583eed9c-65d0-4d3e-b561-faba91ca0ee5";
const postBody = {name: "Casino de Test", location: "Cidade de Teste"};

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/casinos", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
                describe("Sortable", () => {
                    it("status: 200, sortable by name", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name"})
                            .expect(200)
                            .then(({body: {casinos}}) => {
                                expect(casinos).toBeSorted({key: "name"});
                            }));
                    it("status: 200, sortable by name desc", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name", order: "desc"})
                            .expect(200)
                            .then(({body: {casinos}}) => {
                                expect(casinos).toBeSorted({key: "name", descending: true});
                            }));
                });
                describe("Queries", () => {
                    it("status: 200, filter by casino id", () =>
                        request
                            .get(urlPath)
                            .query({casino_id: casinoId})
                            .expect(200)
                            .then(({body: {casinos}}) => {
                                expect(casinos).toHaveLength(1);
                                const [casino] = casinos;
                                expect(casino).toHaveProperty("id", casinoId);
                            }));
                });
                it("status: 200", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {casinos}}) => {
                            expect(casinos).not.toBe(null);
                            expect(Array.isArray(casinos)).toBe(true);
                        }));
                it("status: 200, with expected keys", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {casinos}}) => {
                            casinos.forEach(casino => {
                                expect(Object.keys(casino)).toEqual(expectedKeys);
                            });
                        }));
                it("status: 200, no deleted casinos", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {casinos}}) => {
                            casinos.forEach(casino => {
                                expect(casino.deleted_at).toBe(null);
                            });
                        }));
            });
            describe("POST", () => {
                it("status: 201, must get succesful status", () => request.post(urlPath).send(postBody).expect(201));
                it("status: 201, returns expected keys for casino", () =>
                    request
                        .post(urlPath)
                        .send(postBody)
                        .expect(201)
                        .then(({body: {casino}}) => {
                            expect(casino).not.toBe(null);
                            expect(typeof casino === "object" && casino.constructor === Object).toBeTruthy();
                            expect(Object.keys(casino)).toEqual(expectedKeys);
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
                    it("status: 400, casino id must contain a valid GUID", () =>
                        request
                            .get(urlPath)
                            .query({casino_id: "invalid"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"casino_id" must be a valid GUID');
                            }));
                });
            });
            describe("POST", () => {
                it("status: 400, should have required keys", () =>
                    request
                        .post(urlPath)
                        .send({name: "Casino de test"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"location" is required');
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
                it("status: 400, casino should be unique [name must be unique]", () =>
                    request
                        .post(urlPath)
                        .send({name: "Casino Estoril", location: "Estoril"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"Casino Estoril" already exists');
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
                    it("status: 200", () => request.get(`${urlPath}/${casinoId}`).expect(200));
                    it("status: 200, should return an object", () =>
                        request
                            .get(`${urlPath}/${casinoId}`)
                            .expect(200)
                            .then(({body: {casino}}) => {
                                expect(casino).not.toBe(null);
                                expect(typeof casino === "object" && casino.constructor === Object).toBeTruthy();
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .get(`${urlPath}/${casinoId}`)
                            .expect(200)
                            .then(({body: {casino}}) => {
                                expect(Object.keys(casino)).toEqual(expectedKeys);
                            }));
                });
                describe("DELETE", () => {
                    it("status: 204, should be able to soft delete", () =>
                        request.delete(`${urlPath}/${casinoIdDelete}`).expect(204));
                    it("status: 204, should return empty object", () =>
                        request
                            .delete(`${urlPath}/${casinoIdDelete}`)
                            .expect(204)
                            .then(({body}) => {
                                expect(body).toStrictEqual({});
                            }));
                    it("status: 204, confirm that casino has been soft deleted", () =>
                        request
                            .delete(`${urlPath}/${casinoIdDelete}`)
                            .expect(204)
                            .then(() =>
                                request
                                    .get(urlPath)
                                    .expect(200)
                                    .then(({body: {casinos}}) => {
                                        casinos.forEach(casino => {
                                            expect(casino.id).not.toEqual(casinoIdDelete);
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
                            .get(`${urlPath}/9a5c5991-a14d-4d85-b75f-d75081500c8a`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"9a5c5991-a14d-4d85-b75f-d75081500c8a" could not be found`);
                            }));
                    it("status: 404, should not return a casino that has been deleted", () =>
                        request
                            .get(`${urlPath}/30d877ce-387c-4b9d-8a58-566a035892d0`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"30d877ce-387c-4b9d-8a58-566a035892d0" could not be found`);
                            }));
                });
                describe("DELETE", () => {
                    it("status: 404, should error if casino not found", () =>
                        request
                            .delete(`${urlPath}/583eed9c-65d0-4d3e-b561-faba91ca0ee6`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"583eed9c-65d0-4d3e-b561-faba91ca0ee6" could not be found`);
                            }));
                    it("status: 404, should error if already deleted", () =>
                        request
                            .delete(`${urlPath}/30d877ce-387c-4b9d-8a58-566a035892d0`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"30d877ce-387c-4b9d-8a58-566a035892d0" could not be found`);
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
                    request[method](`${urlPath}/${casinoId}`)
                        .expect(405)
                        .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                );
            });
        });
    });
});
