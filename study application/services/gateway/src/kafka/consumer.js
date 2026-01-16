const { Kafka, logLevel } = require("kafkajs");

const {
  KAFKA_BROKERS = "kafka:9092",
  KAFKA_CLIENT_ID = "gateway-consumer",
  CHAT_OUTPUT_TOPIC = "chat.output",
  CHAT_SCORE_TOPIC = "chat.score",
} = process.env;

function createKafkaConsumer(io, socketRegistry) {
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS.split(","),
    logLevel: logLevel.NOTHING,
  });

  const consumer = kafka.consumer({ groupId: `${KAFKA_CLIENT_ID}-group` });

  async function start() {
    await consumer.connect();
    await consumer.subscribe({ topic: CHAT_OUTPUT_TOPIC, fromBeginning: false });
    await consumer.subscribe({ topic: CHAT_SCORE_TOPIC, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value.toString());
        const socketId = socketRegistry.get(event.userId);
        if (!socketId) return;

        if (topic === CHAT_OUTPUT_TOPIC) {
          io.to(socketId).emit("message:receive", event);
        } else if (topic === CHAT_SCORE_TOPIC) {
          io.to(socketId).emit("message:score", event);
        }
      },
    });
  }

  start().catch((error) => {
    console.error("Kafka consumer failed", error);
    process.exit(1);
  });

  return consumer;
}

module.exports = createKafkaConsumer;
