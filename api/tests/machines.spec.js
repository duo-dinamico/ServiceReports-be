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
const invalidMethods = ["put", "patch", "delete"];
const invalidMethodsId = ["post", "put"];
const machineId = "f8cae396-5376-47ae-8dfc-690572e76a09";
const patchBody = {
    manufacturer: "Test manufacturer",
    model: "Test model",
    serial_number: "Teste Serial Number",
    department_id: "04ef48c0-38b3-4cdc-b483-2d72dfa81527",
};
const postBody = {
    manufacturer: "Test manufacturer",
    model: "Test model",
    serial_number: "Teste Serial Number",
    department_id: "04ef48c0-38b3-4cdc-b483-2d72dfa81527",
};

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/machines", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
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
                    it("status: 200, filter by department", () =>
                        request
                            .get(urlPath)
                            .query({department_id: "a7895b03-70a2-4bab-8e0f-dbc561e6d098"})
                            .expect(200)
                            .then(({body: {machines}}) => {
                                expect(machines).toHaveLength(1);
                                const [machine] = machines;
                                expect(machine).toHaveProperty("department.id", "a7895b03-70a2-4bab-8e0f-dbc561e6d098");
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
            describe("POST", () => {
                it("status: 201, must get succesful status", () => request.post(urlPath).send(postBody).expect(201));
                it("status: 201, returns expected keys for machine", () =>
                    request
                        .post(urlPath)
                        .send(postBody)
                        .expect(201)
                        .then(({body: {machine}}) => {
                            expect(machine).not.toBe(null);
                            expect(typeof machine === "object" && machine.constructor === Object).toBeTruthy();
                            expect(Object.keys(machine)).toEqual(expectedKeys);
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
            });
            describe("POST", () => {
                it("status: 400, should have required keys", () =>
                    request
                        .post(urlPath)
                        .send({manufacturer: postBody.manufacturer})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"model" is required');
                        }));
                it("status: 400, values should be strings", () =>
                    request
                        .post(urlPath)
                        .send({manufacturer: 12345})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"manufacturer" must be a string');
                        }));
                it("status: 400, serial number and model should be unique", () =>
                    request
                        .post(urlPath)
                        .send({
                            manufacturer: "TCS",
                            model: "Chipper Champ 2",
                            serial_number: "087610101A",
                            department_id: "04ef48c0-38b3-4cdc-b483-2d72dfa81527",
                        })
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe(
                                "Machine Chipper Champ 2 with serial number 087610101A already exists"
                            );
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
                it("status: 404, department must exist", () =>
                    request
                        .post(urlPath)
                        .send({...postBody, department_id: "341ae597-6e26-4c2a-9966-26447522a21f"})
                        .expect(404)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Not Found");
                            expect(message).toBe('"341ae597-6e26-4c2a-9966-26447522a21f" could not be found');
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
                    it("status: 200", () => request.get(`${urlPath}/${machineId}`).expect(200));
                    it("status: 200, should return an object", () =>
                        request
                            .get(`${urlPath}/${machineId}`)
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(machine).not.toBe(null);
                                expect(typeof machine === "object" && machine.constructor === Object).toBeTruthy();
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .get(`${urlPath}/${machineId}`)
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(Object.keys(machine)).toEqual(expectedKeys);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 200, should be able to patch a machine", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send(patchBody)
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(machine.id).toBe(machineId);
                                expect(machine.manufacturer).toBe(patchBody.manufacturer);
                                expect(machine.model).toBe(patchBody.model);
                                expect(machine.serial_number).toBe(patchBody.serial_number);
                                expect(machine.department.id).toBe(patchBody.department_id);
                            }));
                    it("status: 200, should be able to patch only machine department", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({department_id: patchBody.department_id})
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(machine.id).toBe(machineId);
                                expect(machine.department.id).toBe(patchBody.department_id);
                            }));
                    it("status: 200, should be able to patch only machine manufacturer", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({manufacturer: patchBody.manufacturer})
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(machine.id).toBe(machineId);
                                expect(machine.manufacturer).toBe(patchBody.manufacturer);
                            }));
                    it("status: 200, should be able to patch only machine model", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({model: patchBody.model})
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(machine.id).toBe(machineId);
                                expect(machine.model).toBe(patchBody.model);
                            }));
                    it("status: 200, should return expected keys", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send(patchBody)
                            .expect(200)
                            .then(({body: {machine}}) => {
                                expect(Object.keys(machine)).toEqual(expectedKeys);
                            }));
                });
                describe("DELETE", () => {
                    it("status: 204, should be able to soft delete a machine", () =>
                        request.delete(`${urlPath}/${machineId}`).expect(204));
                    it("status: 204, should return empty object", () =>
                        request
                            .delete(`${urlPath}/${machineId}`)
                            .expect(204)
                            .then(({body}) => {
                                expect(body).toStrictEqual({});
                            }));
                    it("status: 204, confirm that machine has been soft deleted", () =>
                        request
                            .delete(`${urlPath}/${machineId}`)
                            .expect(204)
                            .then(() =>
                                request
                                    .get(urlPath)
                                    .expect(200)
                                    .then(({body: {machines}}) => {
                                        machines.forEach(machine => {
                                            expect(machine.id).not.toEqual(machineId);
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
                            .get(`${urlPath}/f8cae396-5376-47ae-8dfc-690572e76a08`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"f8cae396-5376-47ae-8dfc-690572e76a08" could not be found`);
                            }));
                    it("status: 404, should not return a machine that has been deleted", () =>
                        request
                            .get(`${urlPath}/14772f69-0c53-409c-a373-f7db7f0543cf`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"14772f69-0c53-409c-a373-f7db7f0543cf" could not be found`);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 400, empty body not allowed", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"value" must have at least 1 key');
                            }));
                    it("status: 400, keys must be manufacturer, model, serial_number or department_id", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({fake_key: "the only key for you"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"fake_key" is not allowed');
                            }));
                    it("status: 400, manufacturer must be string", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({manufacturer: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"manufacturer" must be a string');
                            }));
                    it("status: 400, model must be string", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({model: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"model" must be a string');
                            }));
                    it("status: 400, serial_number must be string", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({serial_number: 123})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"serial_number" must be a string');
                            }));
                    it("status: 400, department_id must be string and of type UUID", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({department_id: "not a good string"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe('"department_id" must be a valid GUID');
                            }));
                    it("status: 400, serial number and model combination should be unique", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({manufacturer: "Test manufacturer", model: "One 2 Six", serial_number: "01010101A"})
                            .expect(400)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Bad Request");
                                expect(message).toBe("Machine One 2 Six with serial number 01010101A already exists");
                            }));
                    it("status: 404, department must exist", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({department_id: "341ae597-6e26-4c2a-9966-26447522a22e"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"341ae597-6e26-4c2a-9966-26447522a22e" could not be found');
                            }));
                    it("status: 404, department must not be deleted", () =>
                        request
                            .patch(`${urlPath}/${machineId}`)
                            .send({department_id: "329adfd4-9880-49ee-b650-af3f24dc4929"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"329adfd4-9880-49ee-b650-af3f24dc4929" could not be found');
                            }));
                });
                describe("DELETE", () => {
                    it("status: 404, should error if machine not found", () =>
                        request
                            .delete(`${urlPath}/341ae597-6e26-4c2a-9966-26447522a21f`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"341ae597-6e26-4c2a-9966-26447522a21f" could not be found`);
                            }));
                    it("status: 404, should error if already deleted", () =>
                        request
                            .delete(`${urlPath}/14772f69-0c53-409c-a373-f7db7f0543cf`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"14772f69-0c53-409c-a373-f7db7f0543cf" could not be found`);
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
                    request[method](`${urlPath}/${machineId}`)
                        .expect(405)
                        .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                );
            });
        });
    });
});
