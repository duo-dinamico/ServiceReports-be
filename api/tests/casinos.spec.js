process.env.ENVIRONMENT = "test";
const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "name", "location", "created_at", "updated_at", "deleted_at"];
const urlPath = "/api/casinos";
const invalidMethods = ["post", "put", "patch", "delete"];

const casinoId = "446470f4-aeff-4fb7-9b53-38b434ca2488";

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/casinos", () => {
        describe("DEFAULT BEHAVIOUR", () => {
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
            it.each(invalidMethods)("status:405, invalid method - %s", async method =>
                request[method](urlPath)
                    .expect(405)
                    .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
            );
        });
    });
});
