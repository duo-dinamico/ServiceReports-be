process.env.ENVIRONMENT = "test";
const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = ["id", "name", "created_at", "updated_at", "deleted_at", "casino"];
const urlPath = "/api/departments";
const invalidMethods = ["post", "put", "patch", "delete"];

const departmentId = "a7895b03-70a2-4bab-8e0f-dbc561e6d098";

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/departments", () => {
        describe("DEFAULT BEHAVIOUR", () => {
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
            it("status: 200, no deleted casinos", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {departments}}) => {
                        departments.forEach(department => {
                            expect(department.casino.id).not.toEqual("30d877ce-387c-4b9d-8a58-566a035892d0");
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
                it("status: 400, department id must contain a valid GUID", () =>
                    request
                        .get(urlPath)
                        .query({department_id: "invalid"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"department_id" must be a valid GUID');
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
