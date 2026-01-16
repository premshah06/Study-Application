const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

describe("JWT Token Tests", () => {
    it("should create a valid JWT token", () => {
        const userId = "testuser123";
        const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });

    it("should verify a valid JWT token", () => {
        const userId = "testuser123";
        const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });

        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.sub).toBe(userId);
    });

    it("should reject an invalid JWT token", () => {
        const invalidToken = "invalid.token.here";

        expect(() => {
            jwt.verify(invalidToken, JWT_SECRET);
        }).toThrow();
    });

    it("should reject a token with wrong secret", () => {
        const userId = "testuser123";
        const token = jwt.sign({ sub: userId }, "wrongsecret", { expiresIn: "1h" });

        expect(() => {
            jwt.verify(token, JWT_SECRET);
        }).toThrow();
    });
});
