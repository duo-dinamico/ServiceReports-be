const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
const expectedKeys = [
    "id",
    "manufacturer",
    "model",
    "serial_number",
    "created_at",
    "updated_at",
    "deleted_at",
    "department",
];
const urlPath = "/api/machines";
const invalidMethods = ["post", "put", "patch", "delete"];

const machineId = "f8cae396-5376-47ae-8dfc-690572e76a09";

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/machines", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("Sortable", () => {
                it("status: 200, sortable by manufacturer", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "manufacturer"})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toBeSorted({key: "manufacturer"});
                        }));
                it("status: 200, sortable by model", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "model"})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toBeSorted({key: "model"});
                        }));
                it("status: 200, sortable by manufacturer desc", () =>
                    request
                        .get(urlPath)
                        .query({sort_by: "manufacturer", order: "desc"})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toBeSorted({key: "manufacturer", descending: true});
                        }));
            });
            describe("Queries", () => {
                it("status: 200, filter by machine id", () =>
                    request
                        .get(urlPath)
                        .query({machine_id: machineId})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toHaveLength(1);
                            const [machine] = machines;
                            expect(machine).toHaveProperty("id", machineId);
                        }));
                it("status: 200, filter by manufacturer", () =>
                    request
                        .get(urlPath)
                        .query({manufacturer: "TCS"})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toHaveLength(1);
                            const [machine] = machines;
                            expect(machine).toHaveProperty("manufacturer", "TCS");
                        }));
                it("status: 200, filter by model", () =>
                    request
                        .get(urlPath)
                        .query({model: "Chipper Champ 2"})
                        .expect(200)
                        .then(({body: {machines}}) => {
                            expect(machines).toHaveLength(1);
                            const [machine] = machines;
                            expect(machine).toHaveProperty("model", "Chipper Champ 2");
                        }));
            });
            it("status: 200", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {machines}}) => {
                        expect(machines).not.toBe(null);
                        expect(Array.isArray(machines)).toBe(true);
                    }));
            it("status: 200, with expected keys", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {machines}}) => {
                        machines.forEach(machine => {
                            expect(Object.keys(machine)).toEqual(expectedKeys);
                        });
                    }));
            it("status: 200, no deleted machines", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {machines}}) => {
                        machines.forEach(machine => {
                            expect(machine.deleted_at).toBe(null);
                        });
                    }));
            it("status: 200, no deleted departments", () =>
                request
                    .get(urlPath)
                    .expect(200)
                    .then(({body: {machines}}) => {
                        machines.forEach(machine => {
                            expect(machine.department.id).not.toEqual("329adfd4-9880-49ee-b650-af3f24dc4929");
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
                            expect(message).toBe('"sort_by" must be one of [manufacturer, model]');
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
                it("status: 400, machine id must contain a valid GUID", () =>
                    request
                        .get(urlPath)
                        .query({machine_id: "invalid"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"machine_id" must be a valid GUID');
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
