const express = require("express");
const User = require("../models/User");
const Streak = require("../models/Streak");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ bestStreak: -1 })
            .limit(10)
            .select("userId bestStreak -_id");
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// Record a new streak
router.post("/streak", authenticate, async (req, res) => {
    const { duration, topic } = req.body;
    const userId = req.user.sub;

    if (typeof duration !== "number" || !topic) {
        return res.status(400).json({ error: "Duration and topic are required" });
    }

    try {
        // Save streak history
        const streak = new Streak({ userId, duration, topic });
        await streak.save();

        // Update user best streak if needed
        await User.findOneAndUpdate(
            { userId },
            {
                $max: { bestStreak: duration },
                $set: { lastActive: new Date() }
            }
        );

        res.json({ status: "success", streak });
    } catch (error) {
        console.error("Streak save error:", error);
        res.status(500).json({ error: "Failed to save streak" });
    }
});

// Get user history
router.get("/history", authenticate, async (req, res) => {
    const userId = req.user.sub;
    try {
        const history = await Streak.find({ userId })
            .sort({ endedAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Get user summary stats
router.get("/summary", authenticate, async (req, res) => {
    const userId = req.user.sub;
    try {
        const streaks = await Streak.find({ userId });
        const user = await User.findOne({ userId });

        const totalSessions = streaks.length;
        const totalDuration = streaks.reduce((acc, s) => acc + s.duration, 0);
        const bestStreak = user ? user.bestStreak : 0;
        const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

        res.json({
            totalSessions,
            totalDuration,
            bestStreak,
            avgDuration: Math.round(avgDuration),
            lastActive: user ? user.lastActive : null
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

module.exports = router;
