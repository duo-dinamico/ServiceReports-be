process.env.NODE_ENV = "test";
const supertest = require("supertest");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);

describe("/api", () => {
    beforeEach(() => connection.seed.run());
    afterAll(() => connection.destroy());
    describe("/users", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            it("status: 200", () =>
                request
                    .get("/api/users")
                    .expect(200)
                    .then(({body: {users}}) => {
                        expect(users).not.toBe(null);
                        expect(Array.isArray(users)).toBe(true);
                    }));
        });
    });
});
