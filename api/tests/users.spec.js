const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "username", "name", "created_at", "updated_at", "deleted_at"];
const urlPath = "/api/users";
const invalidMethods = ["post", "put", "patch", "delete"];
const invalidMethodsId = ["post", "put", "patch"];
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
                    it("status: 404, gets a user by id", () =>
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
                                    .then(({body: {error, data}}) => {
                                        expect(error).toBe("Not Found");
                                        expect(data.message).toBe(`"${deleteUserId}" could not be found`);
                                    })
                            ));
                    it("status: 404, should error if user doesn't exist", () =>
                        request
                            .delete(`${urlPath}/1ebd707a-894e-41b1-881e-d222379ac1f5`)
                            .expect(404)
                            .then(({body: {error, data}}) => {
                                expect(error).toBe("Not Found");
                                expect(data.message).toBe(`"1ebd707a-894e-41b1-881e-d222379ac1f5" could not be found`);
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
