const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const {
  JWT_SECRET = "supersecret",
} = process.env;

router.post("/token", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Upsert user in database
    await User.findOneAndUpdate(
      { userId },
      { $set: { lastActive: new Date() }, $inc: { totalSessions: 1 } },
      { upsert: true, new: true }
    );

    const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
