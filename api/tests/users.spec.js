process.env.ENVIRONMENT = "test";
const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "username", "name", "created_at", "updated_at", "deleted_at"];
const urlPath = "/api/users";
const invalidMethods = ["post", "put", "patch", "delete"];

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/users", () => {
        describe("DEFAULT BEHAVIOUR", () => {
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
        describe("ERROR HANDLING", () => {
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
            it.each(invalidMethods)("status:405, invalid method - %s", async method =>
                request[method](urlPath)
                    .expect(405)
                    .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
            );
        });
    });
});
