const request = require("supertest");
const { app } = require("../src/server");

describe("Gateway API Tests", () => {
    describe("Health Check", () => {
        it("should return 200 and status ok", async () => {
            const response = await request(app).get("/health");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "ok" });
        });
    });

    describe("Auth Routes", () => {
        describe("POST /api/auth/token", () => {
            it("should return a token for valid userId", async () => {
                const response = await request(app)
                    .post("/api/auth/token")
                    .send({ userId: "testuser123" });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("token");
                expect(typeof response.body.token).toBe("string");
            });

            it("should return 400 if userId is missing", async () => {
                const response = await request(app)
                    .post("/api/auth/token")
                    .send({});

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("error");
                expect(response.body.error).toBe("userId is required");
            });

            it("should return 400 if userId is empty string", async () => {
                const response = await request(app)
                    .post("/api/auth/token")
                    .send({ userId: "" });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("error");
            });
        });
    });

    describe("Chat Routes", () => {
        describe("GET /api/chat", () => {
            it("should return chat service status", async () => {
                const response = await request(app).get("/api/chat");

                expect(response.status).toBe(200);
                expect(response.body).toEqual({ status: "chat service online" });
            });
        });
    });
});
