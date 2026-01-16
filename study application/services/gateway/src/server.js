const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const createKafkaConsumer = require("./kafka/consumer");
const KafkaProducer = require("./kafka/producer");
const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const statsRouter = require("./routes/stats");
const mongoose = require("mongoose");

const {
  PORT = 4000,
  JWT_SECRET = "supersecret",
  CHAT_INPUT_TOPIC = "chat.input",
  MONGO_URI = "mongodb://mongodb:27017/studyapplication"
} = process.env;

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/stats", statsRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const socketRegistry = new Map();
const isTestEnv = process.env.NODE_ENV === "test";
const producer = isTestEnv
  ? { produce: async () => { } }
  : KafkaProducer.getInstance();

if (!isTestEnv) {
  createKafkaConsumer(io, socketRegistry);
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing token"));
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?.sub;
  if (!userId) {
    socket.disconnect(true);
    return;
  }

  socketRegistry.set(userId, socket.id);

  socket.on("disconnect", () => {
    if (socketRegistry.get(userId) === socket.id) {
      socketRegistry.delete(userId);
    }
  });

  socket.on("message:send", (payload) => {
    const event = {
      userId,
      socketId: socket.id,
      message: payload.message,
      topic: payload.topic, // Pass topic from payload
      isInitial: payload.isInitial || false, // Pass initial greeting flag
      timestamp: new Date().toISOString(),
    };
    producer.produce(CHAT_INPUT_TOPIC, event).catch((err) => {
      console.error("Kafka produce failure:", err);
    });
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Gateway listening on :${PORT}`));
}

module.exports = { app, server, io };
