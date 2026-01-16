# Gateway Service

Node.js + Express API gateway with Socket.IO and Kafka integration.

## Features

- 🔐 JWT authentication
- 🔌 Socket.IO real-time communication
- 📨 Kafka producer/consumer for event-driven architecture
- 🗄️ MongoDB integration (ready for future use)
- ✅ Comprehensive test coverage with Jest

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/studyapplication
KAFKA_BROKERS=localhost:9092
JWT_SECRET=supersecret-change-in-production
CHAT_INPUT_TOPIC=chat.input
CHAT_OUTPUT_TOPIC=chat.output
CHAT_SCORE_TOPIC=chat.score
NODE_ENV=development
```

### Development

```bash
npm run dev
```

The server will be available at `http://localhost:4000`

### Production

```bash
npm start
```

### Testing

```bash
npm test
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### Authentication

```
POST /api/auth/token
Body: { "userId": "string" }
```

Returns JWT token for authentication.

### Chat

```
GET /api/chat
```

Returns chat service status.

## Socket.IO Events

### Client → Server

- `message:send` - Send a message to the AI

### Server → Client

- `message:receive` - Receive AI response
- `message:score` - Receive confusion score update

## Project Structure

```
src/
├── kafka/
│   ├── consumer.js    # Kafka consumer
│   └── producer.js    # Kafka producer
├── routes/
│   ├── auth.js        # Auth routes
│   └── chat.js        # Chat routes
└── server.js          # Main server
```

## Technologies

- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **KafkaJS** - Kafka client
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Jest** - Testing framework
