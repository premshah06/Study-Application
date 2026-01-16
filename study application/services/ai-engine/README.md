# AI Engine Service

Python-based AI engine that processes chat messages and generates persona-based responses.

## Features

- 🤖 AI persona-based question generation
- 📊 Confusion score calculation
- 📨 Kafka consumer/producer for event processing
- ⚡ Async processing with asyncio
- ✅ Comprehensive test coverage with pytest

## Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Install Test Dependencies

```bash
pip install -r requirements-test.txt
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
KAFKA_BROKERS=localhost:9092
CHAT_INPUT_TOPIC=chat.input
CHAT_OUTPUT_TOPIC=chat.output
CHAT_SCORE_TOPIC=chat.score
SERVICE_ID=ai-engine
OPENAI_API_KEY=your-openai-api-key-here
```

### Running

```bash
python -m app.consumer
```

### Testing

```bash
pytest tests/ -v
```

### Testing with Coverage

```bash
pytest tests/ --cov=app --cov-report=html
```

## How It Works

1. **Consumes** messages from `chat.input` topic
2. **Generates** AI persona-based questions using the user's message
3. **Produces** AI response to `chat.output` topic
4. **Calculates** confusion score and produces to `chat.score` topic

## Personas

### Fullstack Persona (Jason)
A junior React developer who is confused about server-side concepts.

### ML Persona (Pat)
A product manager who doesn't understand technical ML concepts.

## Project Structure

```
app/
├── __init__.py
├── consumer.py       # Main Kafka consumer and processing logic
└── prompts.py        # AI persona definitions
tests/
├── __init__.py
├── test_consumer.py  # Consumer tests
└── test_prompts.py   # Prompt tests
```

## Technologies

- **Python 3.11** - Programming language
- **aiokafka** - Async Kafka client
- **OpenAI** - AI completions (ready for integration)
- **pytest** - Testing framework
