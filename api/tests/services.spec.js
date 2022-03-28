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
const expectedKeysId = [
    "id",
    "department",
    "machines",
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
const invalidMethods = ["put", "patch", "delete"];
const invalidMethodsId = ["post", "put"];
const invalidMethodsRevision = ["get", "post", "put", "delete"];
const departmentId = "1ed90dca-dd68-476a-bd48-63b2a5d66c2f";
const createdBy = "9a5c5991-a14d-4d85-b75f-d75081500c8d";
const closedBy = "435ccd69-f989-4219-a3c7-9f09ff32c6cb";
const serviceId = "435fc172-dff3-4294-ab7b-7e929d00aa44";
const machineId = "f8cae396-5376-47ae-8dfc-690572e76a09";
const patchBody = {
    // TODO: user should be in header
    user_id: "af275e22-a0ef-4e85-9926-c1abe1c1d192",
};
const postBody = {
    user_id: "af275e22-a0ef-4e85-9926-c1abe1c1d192",
    department_id: departmentId,
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
                                expect(services).toHaveLength(2);
                                services.forEach(service => {
                                    expect(service).toHaveProperty("closed_by.id", closedBy);
                                });
                            }));
                    it("status: 200, show deleted services", () =>
                        request
                            .get(urlPath)
                            .query({show_deleted: true})
                            .expect(200)
                            .then(({body: {services}}) => {
                                expect(services).toHaveLength(5);
                                services.forEach(service => {
                                    if (service.id === "31618d24-204c-49b0-b5ee-0ada5673940e") {
                                        expect(service.deleted_at).not.toBe(null);
                                        expect(service.deleted_by).not.toBe(null);
                                    }
                                });
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
                                expect(service.deleted_by.id).toBe(null);
                            });
                        }));
            });
            describe("POST", () => {
                it("status: 201, must get succesful status", () => request.post(urlPath).send(postBody).expect(201));
                it("status: 201, returns expected keys for service", () =>
                    request
                        .post(urlPath)
                        .send(postBody)
                        .expect(201)
                        .then(({body: {service}}) => {
                            expect(service).not.toBe(null);
                            expect(typeof service === "object" && service.constructor === Object).toBeTruthy();
                            expect(Object.keys(service)).toEqual(expectedKeysId);
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
            describe("POST", () => {
                it("status: 400, should have required keys", () =>
                    request
                        .post(urlPath)
                        .send({user_id: postBody.user_id})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"department_id" is required');
                        }));
                it("status: 400, values should be string and formatted as UUID", () =>
                    request
                        .post(urlPath)
                        .send({user_id: 12345})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe('"user_id" must be a string');
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
                it("status: 404, user must exist", () =>
                    request
                        .post(urlPath)
                        .send({...postBody, user_id: "af275e22-a0ef-4e85-9926-c1abe1c1d193"})
                        .expect(404)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Not Found");
                            expect(message).toBe('"af275e22-a0ef-4e85-9926-c1abe1c1d193" could not be found');
                        }));
                it("status: 400, department must have machines", () =>
                    request
                        .post(urlPath)
                        .send({...postBody, department_id: "d2f2b92c-3d48-4d0f-a385-9dc0592f1ac4"})
                        .expect(400)
                        .then(({body: {error, message}}) => {
                            expect(error).toBe("Bad Request");
                            expect(message).toBe(
                                "Department d2f2b92c-3d48-4d0f-a385-9dc0592f1ac4 has no machines. Please add at least one before creating a service"
                            );
                        }));
            });
            it.each(invalidMethods)("status:405, invalid method - %s", async method =>
                request[method](urlPath)
                    .expect(405)
                    .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
            );
        });
        describe("/:service_id", () => {
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
                                expect(Object.keys(service)).toEqual(expectedKeysId);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 200, should be able to close a service and all revisions", () => {
                        const patchService = {
                            ...patchBody,
                            closed: true,
                        };
                        return request
                            .patch(`${urlPath}/${serviceId}`)
                            .send(patchService)
                            .expect(200)
                            .then(({body: {service}}) => {
                                expect(Object.keys(service)).toEqual(expectedKeysId);
                                expect(service.closed_at).not.toBe(null);
                                expect(service.closed_by).not.toBe(null);
                            });
                    });
                });
                describe("DELETE", () => {
                    it("status: 204, should be able to soft delete a service", () =>
                        request.delete(`${urlPath}/${serviceId}`).expect(204));
                    it("status: 204, should return empty object", () =>
                        request
                            .delete(`${urlPath}/${serviceId}`)
                            .send(patchBody)
                            .expect(204)
                            .then(({body}) => {
                                expect(body).toStrictEqual({});
                            }));
                    it("status: 204, confirm that service has been soft deleted", () =>
                        request
                            .delete(`${urlPath}/${serviceId}`)
                            .send(patchBody)
                            .expect(204)
                            .then(() =>
                                request
                                    .get(urlPath)
                                    .query({show_deleted: true})
                                    .expect(200)
                                    .then(({body: {services}}) => {
                                        services.forEach(service => {
                                            if (service.id === serviceId) {
                                                expect(service.deleted_at).not.toBe(null);
                                                expect(service.deleted_by).not.toBe(null);
                                            }
                                        });
                                    })
                            ));
                    // TODO: Test if key deleted_at is changing in revision
                });
            });
            describe("ERROR HANDLING", () => {
                describe("GET", () => {
                    it("status: 400, should error if id not uuid", () =>
                        request
                            .get(`${urlPath}/invalid`)
                            .expect(400)
                            .then(({body: {message}}) => {
                                expect(message).toBe('"service_id" must be a valid GUID');
                            }));
                    it("status: 404, should error if id doesn't exist", () =>
                        request
                            .get(`${urlPath}/48e01a0d-3e9a-4568-bb47-368c13ed3f4a`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"48e01a0d-3e9a-4568-bb47-368c13ed3f4a" could not be found`);
                            }));
                    it("status: 404, should not return a service that has been deleted", () =>
                        request
                            .get(`${urlPath}/31618d24-204c-49b0-b5ee-0ada5673940e`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"31618d24-204c-49b0-b5ee-0ada5673940e" could not be found`);
                            }));
                });
                describe("PATCH", () => {
                    it("status: 404, service id must exist", () =>
                        request
                            .patch(`${urlPath}/435fc172-dff3-4294-ab7b-7e929d00aa45`)
                            .send({...patchBody, closed: true})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe('"435fc172-dff3-4294-ab7b-7e929d00aa45" could not be found');
                            }));
                });
                describe("DELETE", () => {
                    it("status: 404, should error if service not found", () =>
                        request
                            .delete(`${urlPath}/435fc172-dff3-4294-ab7b-7e929d00aa43`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"435fc172-dff3-4294-ab7b-7e929d00aa43" could not be found`);
                            }));
                    it("status: 404, should error if already deleted", () =>
                        request
                            .delete(`${urlPath}/31618d24-204c-49b0-b5ee-0ada5673940e`)
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"31618d24-204c-49b0-b5ee-0ada5673940e" could not be found`);
                            }));
                    it("status: 400, should error if not UUID", () =>
                        request
                            .delete(`${urlPath}/invalid`)
                            .expect(400)
                            .then(({body: {message}}) => {
                                expect(message).toBe('"service_id" must be a valid GUID');
                            }));
                    it("status: 404, should error if user does not exist", () =>
                        request
                            .delete(`${urlPath}/${serviceId}`)
                            .send({user_id: "9a5c5991-a14d-4d85-b75f-d75081500c8c"})
                            .expect(404)
                            .then(({body: {error, message}}) => {
                                expect(error).toBe("Not Found");
                                expect(message).toBe(`"9a5c5991-a14d-4d85-b75f-d75081500c8c" could not be found`);
                            }));
                });
                it.each(invalidMethodsId)("status:405, invalid method - %s", async method =>
                    request[method](`${urlPath}/${departmentId}`)
                        .expect(405)
                        .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                );
            });
            describe("/machine", () => {
                describe("/:machine_id", () => {
                    describe("DEFAULT BEHAVIOUR", () => {
                        describe("PATCH", () => {
                            it("status: 200, should be able to patch a machine revision of a specific service", () => {
                                const patchRevision = {
                                    ...patchBody,
                                    maintained: true,
                                    repaired: true,
                                    operational: false,
                                    comments: "Esta maquina esta como nova",
                                };
                                return request
                                    .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                    .send(patchRevision)
                                    .expect(200)
                                    .then(({body: {revision}}) => {
                                        expect(revision.service_id).toBe(serviceId);
                                        expect(revision.machine_id).toBe(machineId);
                                        expect(revision.comments).toBe(patchRevision.comments);
                                    })
                                    .then(() =>
                                        request
                                            .get(`${urlPath}/${serviceId}`)
                                            .expect(200)
                                            .then(({body: {service}}) => {
                                                expect(service.updated_by.id).toBe(patchBody.user_id);
                                            })
                                    );
                            });
                            it.each(["maintained", "repaired", "operational"])(
                                "status: 200, should be able to update only %s",
                                async updateKey =>
                                    request
                                        .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                        .send({...patchBody, [updateKey]: false})
                                        .expect(200)
                                        .then(({body: {revision}}) => expect(revision[updateKey]).toBe(false))
                            );
                        });
                    });
                    describe("ERROR HANDLING", () => {
                        describe("PATCH", () => {
                            const patchRevision = {
                                ...patchBody,
                                maintained: true,
                                repaired: true,
                                operational: false,
                                comments: "Esta maquina esta como nova",
                            };
                            it("status: 400, only allow the following keys: maintained, repaired, operational, comments", () =>
                                request
                                    .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                    .send({...patchRevision, fake_key: "the only key for you"})
                                    .expect(400)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Bad Request");
                                        expect(message).toBe('"fake_key" is not allowed');
                                    }));
                            it("status: 404, machine id must exist", () =>
                                request
                                    .patch(`${urlPath}/${serviceId}/machine/f8cae396-5376-47ae-8dfc-690572e76a08`)
                                    .send(patchRevision)
                                    .expect(404)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Not Found");
                                        expect(message).toBe(
                                            '"f8cae396-5376-47ae-8dfc-690572e76a08" could not be found'
                                        );
                                    }));
                            it("status: 404, user id must exist", () =>
                                request
                                    .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                    .send({...patchRevision, user_id: "af275e22-a0ef-4e85-9926-c1abe1c1d193"})
                                    .expect(404)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Not Found");
                                        expect(message).toBe(
                                            '"af275e22-a0ef-4e85-9926-c1abe1c1d193" could not be found'
                                        );
                                    }));
                            it.each(["maintained", "repaired", "operational"])(
                                "status: 400, %s should be a boolean",
                                async updateKey =>
                                    request
                                        .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                        .send({...patchBody, [updateKey]: "random"})
                                        .expect(400)
                                        .then(({body: {error, message}}) => {
                                            expect(error).toBe("Bad Request");
                                            expect(message).toBe(`"${updateKey}" must be a boolean`);
                                        })
                            );
                            it("status: 400, comments must be a string", () =>
                                request
                                    .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                    .send({...patchBody, comments: 123})
                                    .expect(400)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Bad Request");
                                        expect(message).toBe('"comments" must be a string');
                                    }));
                            it("status: 400, comments must have a maximum size of 255 characters", () =>
                                request
                                    .patch(`${urlPath}/${serviceId}/machine/${machineId}`)
                                    .send({...patchBody, comments: "a".repeat(256)})
                                    .expect(400)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Bad Request");
                                        expect(message).toBe(
                                            '"comments" length must be less than or equal to 255 characters long'
                                        );
                                    }));
                            it("status: 400, machine must have revisions", () =>
                                request
                                    .patch(
                                        `${urlPath}/72bcff39-0f89-47fe-b123-94c58e18dcda/machine/71180284-1032-4d32-a6ad-830698aa6330`
                                    )
                                    .send(patchRevision)
                                    .expect(400)
                                    .then(({body: {error, message}}) => {
                                        expect(error).toBe("Bad Request");
                                        expect(message).toBe(
                                            "Machine 71180284-1032-4d32-a6ad-830698aa6330 has no revisions."
                                        );
                                    }));
                        });
                        it.each(invalidMethodsRevision)("status:405, invalid method - %s", async method =>
                            request[method](`${urlPath}/${serviceId}/machine/${machineId}`)
                                .expect(405)
                                .then(({body: {error}}) => expect(error).toBe("Method Not Allowed"))
                        );
                    });
                });
            });
        });
    });
});
