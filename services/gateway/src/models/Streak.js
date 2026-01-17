const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    duration: {
        type: Number, // duration in seconds
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    endedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Ensure we have an index for leaderboard queries
streakSchema.index({ duration: -1 });

module.exports = mongoose.model("Streak", streakSchema);
