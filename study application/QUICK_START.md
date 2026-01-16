# 🚀 Study Application Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Docker Desktop installed and running
- ✅ Node.js 20+ (for local development)
- ✅ Python 3.11+ (for local development)

## Option 1: Docker Compose (Recommended) 🐳

### Start the Application

```bash
# Navigate to project root
cd "/Users/premshah/p/Study Application/study application"

# Start all services
docker compose -f infrastructure/docker-compose.yml up --build
```

### Access the Application

Once all services are running:
- **Frontend**: http://localhost:3001
- **Gateway API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### Using the Application

1. Open http://localhost:3001 in your browser
2. Enter any username (e.g., "teacher123")
3. Click "Start Teaching"
4. Start explaining a concept to the AI student
5. The AI will ask questions based on what you teach
6. Watch your confusion score update in real-time

### Stop the Application

```bash
# Stop all services
docker compose -f infrastructure/docker-compose.yml down

# Stop and remove volumes (clean slate)
docker compose -f infrastructure/docker-compose.yml down -v
```

## Option 2: Local Development 💻

### Automated Setup

```bash
# Run the setup script
bash scripts/setup.sh
```

### Manual Setup

#### 1. Frontend
```bash
cd services/frontend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:3001
```

#### 2. Gateway
```bash
cd services/gateway
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:4000
```

#### 3. AI Engine
```bash
cd services/ai-engine
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m app.consumer
```

#### 4. Infrastructure (Kafka, MongoDB)
```bash
# Start only infrastructure services
docker compose -f infrastructure/docker-compose.yml up zookeeper kafka mongodb
```

## Testing 🧪

### Run All Tests

```bash
# Automated test runner
bash scripts/test-all.sh
```

### Run Individual Service Tests

#### Frontend Tests
```bash
cd services/frontend
npm test
```

#### Gateway Tests
```bash
cd services/gateway
npm test
```

#### AI Engine Tests
```bash
cd services/ai-engine
source venv/bin/activate  # If not already activated
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html
```

## Troubleshooting 🔧

### Docker Issues

**Problem**: Services won't start
```bash
# Check Docker is running
docker ps

# Clean up and restart
docker compose -f infrastructure/docker-compose.yml down -v
docker compose -f infrastructure/docker-compose.yml up --build
```

**Problem**: Port already in use
```bash
# Check what's using the port
lsof -i :3001  # Frontend
lsof -i :4000  # Gateway
lsof -i :9092  # Kafka

# Kill the process or change ports in docker-compose.yml
```

### Frontend Issues

**Problem**: Dependencies not installed
```bash
cd services/frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Build errors
```bash
npm run build
# Check output for specific errors
```

### Gateway Issues

**Problem**: Can't connect to Kafka
- Ensure Kafka is running: `docker ps | grep kafka`
- Check Kafka logs: `docker compose -f infrastructure/docker-compose.yml logs kafka`

**Problem**: MongoDB connection failed
- Ensure MongoDB is running: `docker ps | grep mongo`
- Check connection string in `.env`

### AI Engine Issues

**Problem**: Module not found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Problem**: Kafka connection timeout
- Ensure Kafka is accessible at the configured broker address
- Check `KAFKA_BROKERS` in `.env`

## Environment Variables 🔐

### Frontend (.env)
```bash
VITE_GATEWAY_URL=http://localhost:4000
```

### Gateway (.env)
```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/studyapplication
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your-secret-key-here
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
OPENAI_API_KEY=your-openai-key-here  # Optional for now
```

## Development Workflow 🔄

### Making Changes

1. **Frontend Changes**
   - Edit files in `services/frontend/src/`
   - Hot reload will update automatically
   - Run tests: `npm test`

2. **Gateway Changes**
   - Edit files in `services/gateway/src/`
   - Restart with `npm run dev`
   - Run tests: `npm test`

3. **AI Engine Changes**
   - Edit files in `services/ai-engine/app/`
   - Restart the consumer
   - Run tests: `pytest tests/ -v`

### Adding New Features

1. Create feature branch
2. Implement changes
3. Add tests
4. Run all tests: `bash scripts/test-all.sh`
5. Update documentation
6. Commit and push

## Production Deployment 🚢

### Docker Compose Production

```bash
# Build and run in detached mode
docker compose -f infrastructure/docker-compose.yml up -d --build

# View logs
docker compose -f infrastructure/docker-compose.yml logs -f

# Stop services
docker compose -f infrastructure/docker-compose.yml down
```

### Environment Configuration

For production:
1. Update all `.env` files with production values
2. Change `JWT_SECRET` to a strong random value
3. Update `MONGO_URI` to production MongoDB
4. Configure `KAFKA_BROKERS` for production Kafka cluster
5. Add `OPENAI_API_KEY` for real AI responses

## Monitoring 📊

### Health Checks

```bash
# Gateway health
curl http://localhost:4000/health

# Check all services
docker compose -f infrastructure/docker-compose.yml ps
```

### Logs

```bash
# All services
docker compose -f infrastructure/docker-compose.yml logs -f

# Specific service
docker compose -f infrastructure/docker-compose.yml logs -f frontend
docker compose -f infrastructure/docker-compose.yml logs -f gateway
docker compose -f infrastructure/docker-compose.yml logs -f ai-engine
```

## Next Steps 🎯

1. ✅ Start the application with Docker Compose
2. ✅ Test the basic functionality
3. ✅ Run the test suite
4. ✅ Explore the code structure
5. ✅ Customize AI personas
6. ✅ Add new features
7. ✅ Deploy to production

## Support 💬

- Check `README.md` for detailed documentation
- Review service-specific READMEs in each service folder
- Check `PROJECT_SUMMARY.md` for implementation details

---

**Happy Teaching! 🎓**
