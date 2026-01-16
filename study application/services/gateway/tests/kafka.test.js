const KafkaProducer = require("../src/kafka/producer");

// Mock kafkajs
jest.mock("kafkajs", () => {
    const mockProducer = {
        connect: jest.fn().mockResolvedValue(undefined),
        send: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
    };

    const mockKafka = {
        producer: jest.fn(() => mockProducer),
    };

    return {
        Kafka: jest.fn(() => mockKafka),
        logLevel: {
            NOTHING: 0,
        },
    };
});

describe("Kafka Producer Tests", () => {
    let producer;

    beforeEach(() => {
        // Reset singleton instance
        KafkaProducer.instance = undefined;
        producer = KafkaProducer.getInstance();
    });

    afterEach(async () => {
        if (producer) {
            await producer.disconnect();
        }
    });

    it("should create a singleton instance", () => {
        const producer1 = KafkaProducer.getInstance();
        const producer2 = KafkaProducer.getInstance();

        expect(producer1).toBe(producer2);
    });

    it("should produce a message to a topic", async () => {
        const topic = "test.topic";
        const value = { message: "test message" };

        await producer.produce(topic, value);

        expect(producer.producer.send).toHaveBeenCalled();
    });

    it("should disconnect properly", async () => {
        await producer.disconnect();

        expect(producer.producer.disconnect).toHaveBeenCalled();
        expect(KafkaProducer.instance).toBeUndefined();
    });
});
