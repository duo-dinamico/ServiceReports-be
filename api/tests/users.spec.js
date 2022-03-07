const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "username", "name", "created_at", "updated_at", "deleted_at"];
const urlPath = "/api/users";
const invalidMethods = ["put", "patch", "delete"];
const invalidMethodsId = ["post", "put"];
const deleteUserId = "1ebd707a-894e-41b1-881e-d222379ac1f4";
const userId = "9a5c5991-a14d-4d85-b75f-d75081500c8d";

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/users", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
                describe("Sortable", () => {
                    it("status: 200, sortable by name", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name"})
                            .expect(200)
                            .then(({body: {users}}) => {
                                expect(users).toBeSorted({key: "name"});
                            }));
                    it("status: 200, sortable by name desc", () =>
                        request
                            .get(urlPath)
                            .query({sort_by: "name", order: "desc"})
                            .expect(200)
                            .then(({body: {users}}) => {
                                expect(users).toBeSorted({key: "name", descending: true});
                            }));
                });
                describe("Queries", () => {
                    it("status: 200, filter by user id", () =>
                        request
                            .get(urlPath)
                            .query({user_id: userId})
                            .expect(200)
                            .then(({body: {users}}) => {
                                expect(users).toHaveLength(1);
                                const [user] = users;
                                expect(user).toHaveProperty("id", userId);
                            }));
                });
                it("status: 200", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {users}}) => {
                            expect(users).not.toBe(null);
                            expect(Array.isArray(users)).toBe(true);
                        }));
                it("status: 200, with expected keys", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {users}}) => {
                            users.forEach(user => {
                                expect(Object.keys(user)).toEqual(expectedKeys);
                            });
                        }));
                it("status: 200, no deleted users", () =>
                    request
                        .get(urlPath)
                        .expect(200)
                        .then(({body: {users}}) => {
                            users.forEach(user => {
                                expect(user.deleted_at).toBe(null);
                            });
                        }));
            });
            describe("POST", () => {
                it("status: 201", () =>
                    request
                        .post(urlPath)
                        .send({username: "testpostuser", name: "test post user"})
                        .expect(201)
                        .then(({body: {user}}) => {
                            expect(user).not.toBe(null);
                            expect(typeof user === "object" && user.constructor === Object).toBeTruthy();
                        }));
                it("status: 201, responds with expected keys", () =>
                    request
                        .post(urlPath)
                        .send({username: "testpostuser", name: "test post user"})
                        .expect(201)
                        .then(({body: {user}}) => {
                            expect(Object.keys(user)).toEqual(expectedKeys);
                            expect(user.username).toEqual("testpostuser");
                            expect(user.name).toEqual("test post user");
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
                    it("status: 400, user id must contain a valid GUID", () =>
                        request
                            .get(urlPath)
                            .query({user_id: "invalid"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"user_id" must be a valid GUID');
                            }));
                });
            });
            describe("POST", () => {
                it("status: 400, should error with wrong keys", () =>
                    request
                        .post(urlPath)
                        .send({username: "mytest", name: "second", batatas: "Joao"})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe('"batatas" is not allowed');
                        }));
                it("status: 400, should error if value not string", () =>
                    request
                        .post(urlPath)
                        .send({username: 1234})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe('"username" must be a string');
                        }));
                it("status: 400, should error if user already exists [username must be unique]", () =>
                    request
                        .post(urlPath)
                        .send({username: "jsilva", name: "second"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(message).toBe('"jsilva" already exists');
                            expect(error).toBe("Bad Request");
                        }));
                it("status: 400, should error if username not well formatted [username must follow this regex: ^[a-z]+$ ]", () =>
                    request
                        .post(urlPath)
                        .send({username: "hello john 123"})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe(
                                '"username" with value "hello john 123" fails to match the required pattern: /^[a-z]+$/'
                            );
                        }));
                it("status: 400, should error if no username", () =>
                    request
                        .post(urlPath)
                        .send({name: "mytest"})
                        .expect(400)
                        .then(({body: {message}}) => {
                            expect(message).toBe('"username" is required');
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
                    it("status: 200, gets a user by id", () => request.get(`${urlPath}/${userId}`).expect(200));
                    it("status: 200, should return an object", () =>
                        request
                            .get(`${urlPath}/${userId}`)
                            .expect(200)
                            .then(({body: {user}}) => {
                                expect(user).not.toBe(null);
                                expect(typeof user === "object" && user.constructor === Object).toBeTruthy();
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .get(`${urlPath}/${userId}`)
                            .expect(200)
                            .then(({body: {user}}) => {
                                expect(Object.keys(user)).toEqual(expectedKeys);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 200, should be able to patch an user", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({username: "testusername", name: "testname"})
                            .expect(200)
                            .then(({body: {user}}) => {
                                expect(user.id).toBe(userId);
                                expect(user.username).toBe("testusername");
                                expect(user.name).toBe("testname");
                            }));
                    it("status: 200, should be able to patch only username", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({username: "testusername"})
                            .expect(200)
                            .then(({body: {user}}) => {
                                expect(user.id).toBe(userId);
                                expect(user.username).toBe("testusername");
                            }));
                    it("status: 200, should be able to patch only name", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({name: "testname"})
                            .expect(200)
                            .then(({body: {user}}) => {
                                expect(user.id).toBe(userId);
                                expect(user.name).toBe("testname");
                            }));
                });
                describe("DELETE", () => {
                    it("status: 204, user deleted", () => request.delete(`${urlPath}/${deleteUserId}`).expect(204));
                    it("status: 204, should return an empty object", () =>
                        request
                            .delete(`${urlPath}/${deleteUserId}`)
                            .expect(204)
                            .then(({body}) => expect(body).toStrictEqual({})));
                    it("status: 204, confirm that user has been deleted", () =>
                        request
                            .delete(`${urlPath}/${deleteUserId}`)
                            .expect(204)
                            .then(() =>
                                request
                                    .get(urlPath)
                                    .expect(200)
                                    .then(({body: {users}}) => expect(users.id).not.toEqual(deleteUserId))
                            ));
                });
            });
            describe("ERROR HANDLING", () => {
                describe("GET", () => {
                    it("status: 404, should error if id doesn't exist", () =>
                        request
                            .get(`${urlPath}/9a5c5991-a14d-4d85-b75f-d75081500c8a`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"9a5c5991-a14d-4d85-b75f-d75081500c8a" could not be found`);
                            }));
                    it("status: 400, user id must be of type UUID", () =>
                        request
                            .get(`${urlPath}/invalid`)
                            .expect(400)
                            .then(({body: {message}}) => {
                                expect(message).toBe('"id" must be a valid GUID');
                            }));
                    it("status: 404, should not return a user that has been deleted", () =>
                        request
                            .get(`${urlPath}/d3b77da1-f9a3-4b1b-b747-7a7cb27efe75`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"d3b77da1-f9a3-4b1b-b747-7a7cb27efe75" could not be found`);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 400, empty body not allowed", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"value" must have at least 1 key');
                            }));
                    it("status: 400, keys must be username or name", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({blackknight: "tis but a silly wound"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"blackknight" is not allowed');
                            }));
                    it("status: 400, username must be string", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({username: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"username" must be a string');
                            }));
                    it("status: 400, name must be string", () =>
                        request
                            .patch(`${urlPath}/${userId}`)
                            .send({name: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"name" must be a string');
                            }));
                });
                describe("DELETE", () => {
                    it("status: 404, should not delete and already deleted user", () =>
                        request
                            .delete(`${urlPath}/${deleteUserId}`)
                            .expect(204)
                            .then(() =>
                                request
                                    .delete(`${urlPath}/${deleteUserId}`)
                                    .expect(404)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Not Found");
                                        expect(message).toBe(`"${deleteUserId}" could not be found`);
                                    })
                            ));
                    it("status: 404, should error if user doesn't exist", () =>
                        request
                            .delete(`${urlPath}/1ebd707a-894e-41b1-881e-d222379ac1f5`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"1ebd707a-894e-41b1-881e-d222379ac1f5" could not be found`);
                            }));
                });
                it.each(invalidMethodsId)("status:405, invalid method - %s", async method =>
                    request[method](`${urlPath}/${deleteUserId}`)
                        .expect(405)
                        .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                );
            });
        });
    });
});
