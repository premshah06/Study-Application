# Study Application - Reverse Tutoring Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Enterprise-grade "Reverse Tutoring" platform where users teach AI agents to improve their own understanding. Built with event-driven microservices architecture using React, Node.js, Python, Kafka, and MongoDB.

For a deep dive into the system architecture and design, see the [Full Technical Documentation](./FULL_SYSTEM_DOCUMENTATION.md).

## 🌟 Features

- **Reverse Learning**: Teach AI students to solidify your own knowledge
- **Real-time Communication**: Socket.IO powered instant messaging
- **Event-Driven Architecture**: Kafka-based microservices
- **Confusion Scoring**: Live feedback on teaching effectiveness
- **Beautiful UI**: Modern design with glassmorphism and smooth animations
- **Comprehensive Testing**: Full test coverage across all services
- **Containerized**: Docker Compose for easy deployment

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │◄───────►│   Gateway   │◄───────►│  AI Engine  │
│  (React)    │ Socket  │  (Node.js)  │  Kafka  │  (Python)   │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                        ┌──────▼──────┐
                        │   MongoDB   │
                        └─────────────┘
                               │
                        ┌──────▼──────┐
                        │    Kafka    │
                        │  Zookeeper  │
                        └─────────────┘
```

## 📁 Project Structure

```
/studyapplication-monorepo
├── infrastructure/
│   └── docker-compose.yml      # Docker orchestration
├── k8s/                        # Kubernetes configs (future)
├── services/
│   ├── frontend/               # React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── components/    # UI components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── store/         # Redux store
│   │   │   └── App.tsx
│   │   ├── tests/
│   │   └── package.json
│   ├── gateway/                # Node.js + Express + Socket.IO
│   │   ├── src/
│   │   │   ├── kafka/         # Kafka producer/consumer
│   │   │   ├── routes/        # API routes
│   │   │   └── server.js
│   │   ├── tests/
│   │   └── package.json
│   └── ai-engine/              # Python + Kafka + OpenAI
│       ├── app/
│       │   ├── consumer.py    # Main processing logic
│       │   └── prompts.py     # AI personas
│       ├── tests/
│       └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Run with Docker Compose (Recommended)

```bash
# Start all services
docker compose -f infrastructure/docker-compose.yml up --build

# Access the application
# Frontend: http://localhost:3001
# Gateway API: http://localhost:4000
# Gateway Health: http://localhost:4000/health
```

### Stop Services

```bash
docker compose -f infrastructure/docker-compose.yml down
```

### Clean Up (Remove Volumes)

```bash
docker compose -f infrastructure/docker-compose.yml down -v
```

## 🛠️ Local Development

### Frontend Service

```bash
cd services/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Gateway Service

```bash
cd services/gateway

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test
```

### AI Engine Service

```bash
cd services/ai-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-test.txt

# Copy environment file
cp .env.example .env

# Run the service
python -m app.consumer

# Run tests
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=app --cov-report=html
```

## 🧪 Testing

### Run All Tests

```bash
# Frontend tests
cd services/frontend && npm test

# Gateway tests
cd services/gateway && npm test

# AI Engine tests
cd services/ai-engine && pytest tests/ -v
```

### Test Coverage

All services have comprehensive test coverage:

- **Frontend**: Component tests, Redux tests, Hook tests
- **Gateway**: API tests, Authentication tests, Kafka tests
- **AI Engine**: Consumer tests, Prompt tests, Integration tests

## 🔧 Environment Variables

### Frontend (.env)

```bash
VITE_GATEWAY_URL=http://localhost:4000
```

### Gateway (.env)

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

### AI Engine (.env)

```bash
KAFKA_BROKERS=localhost:9092
CHAT_INPUT_TOPIC=chat.input
CHAT_OUTPUT_TOPIC=chat.output
CHAT_SCORE_TOPIC=chat.score
SERVICE_ID=ai-engine
OPENAI_API_KEY=your-openai-api-key-here
```

## 📡 API Documentation

### REST Endpoints

#### Health Check
```
GET /health
Response: { "status": "ok" }
```

#### Authentication
```
POST /api/auth/token
Body: { "userId": "string" }
Response: { "token": "jwt_token" }
```

#### Chat Service Status
```
GET /api/chat
Response: { "status": "chat service online" }
```

### Socket.IO Events

#### Client → Server
- `message:send` - Send a teaching message to AI
  ```javascript
  { message: "string" }
  ```

#### Server → Client
- `message:receive` - Receive AI student's question
  ```javascript
  { userId: "string", question: "string", origin: "string", timestamp: "ISO8601" }
  ```
- `message:score` - Receive confusion score update
  ```javascript
  { userId: "string", score: number, origin: "string", timestamp: "ISO8601" }
  ```

## 🎯 How It Works

1. **User Authenticates**: Frontend requests JWT token from gateway
2. **WebSocket Connection**: Frontend establishes Socket.IO connection with token
3. **User Teaches**: User sends a teaching message
4. **Event Processing**: 
   - Gateway publishes to `chat.input` Kafka topic
   - AI Engine consumes message
   - AI Engine generates persona-based question
   - AI Engine calculates confusion score
5. **Real-time Updates**:
   - AI response published to `chat.output`
   - Score published to `chat.score`
   - Gateway forwards to user via Socket.IO

## 🤖 AI Personas

### Jason (Fullstack Persona)
A junior React developer confused about server-side concepts. Asks questions about web development fundamentals.

### Pat (ML Persona)
A product manager who doesn't understand technical ML concepts. Asks about data science and machine learning basics.

## 🎨 UI Features

- **Modern Design**: Glassmorphism, gradients, and smooth animations
- **Dark Theme**: Easy on the eyes with vibrant accent colors
- **Responsive**: Works on desktop, tablet, and mobile
- **Real-time Indicators**: Connection status and live updates
- **Confusion Meter**: Visual feedback with color-coded progress bar

## 🔐 Security

- JWT-based authentication
- Token expiration (1 hour)
- Environment-based secrets
- CORS configuration
- Input validation

## 📊 Monitoring

- Health check endpoint
- Connection status indicators
- Real-time event tracking
- Error logging

## 🚢 Deployment

### Docker Compose (Production)

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

### Kubernetes (Future)

Kubernetes configurations are prepared in the `k8s/` directory for future cloud deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the concept of "learning by teaching"
- Event-driven architecture for scalability

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for better learning through teaching**
