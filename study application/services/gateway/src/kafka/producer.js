const { Kafka, logLevel } = require("kafkajs");

const {
  KAFKA_BROKERS = "kafka:9092",
  KAFKA_CLIENT_ID = "gateway-producer",
} = process.env;

class KafkaProducer {
  constructor() {
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: KAFKA_BROKERS.split(","),
      logLevel: logLevel.NOTHING,
    });
    this.producer = this.kafka.producer({ allowAutoTopicCreation: false });
    this.connection = this.producer.connect().catch((error) => {
      console.error("Kafka producer failed to connect", error);
      process.exit(1);
    });
  }

  static getInstance() {
    if (!KafkaProducer.instance) {
      KafkaProducer.instance = new KafkaProducer();
    }
    return KafkaProducer.instance;
  }

  async produce(topic, value) {
    await this.connection;
    return this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
    KafkaProducer.instance = undefined;
  }
}

module.exports = KafkaProducer;
