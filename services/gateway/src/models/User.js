const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    bestStreak: {
        type: Number,
        default: 0,
    },
    totalSessions: {
        type: Number,
        default: 0,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
