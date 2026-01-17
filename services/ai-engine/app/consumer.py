import asyncio
import json
import os
from typing import Any, Dict, List
from collections import defaultdict

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer


KAFKA_BROKERS = os.getenv("KAFKA_BROKERS", "kafka:9092").split(",")
CHAT_INPUT_TOPIC = os.getenv("CHAT_INPUT_TOPIC", "chat.input")
CHAT_OUTPUT_TOPIC = os.getenv("CHAT_OUTPUT_TOPIC", "chat.output")
CHAT_SCORE_TOPIC = os.getenv("CHAT_SCORE_TOPIC", "chat.score")
SERVICE_ID = os.getenv("SERVICE_ID", "ai-engine")

# Store conversation history per user session (userId -> list of messages)
conversation_history: Dict[str, List[Dict[str, str]]] = defaultdict(list)


async def generate_initial_greeting(topic: str) -> Dict[str, Any]:
    """Generate initial greeting when a session starts."""
    from openai import AsyncOpenAI
    from .prompts import get_initial_greeting_prompt
    
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or api_key == "replace-me" or api_key == "your-openai-api-key-here":
        return {
            "question": f"Hi! I'm Jamie, and I'm excited to learn about {topic}. Could you start by giving me a high-level overview of what {topic} is?",
            "score": 0,
            "reasoning": "Initial greeting (fallback mode)"
        }
    
    try:
        client = AsyncOpenAI(api_key=api_key)
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": get_initial_greeting_prompt(topic)},
                {"role": "user", "content": "Generate your initial greeting."}
            ],
            response_format={"type": "json_object"},
            max_tokens=300,
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        return {
            "question": result.get("question", f"Hi! I'm ready to learn about {topic}. Let's begin!"),
            "score": 0,  # Always 0 for initial greeting
            "reasoning": result.get("reasoning", "Initial session greeting")
        }
    except Exception as e:
        print(f"AI Engine Error (initial greeting): {e}", flush=True)
        return {
            "question": f"Hello! I'm Jamie, your AI student. I'm eager to learn about {topic}. Please start by explaining what {topic} is!",
            "score": 0,
            "reasoning": f"Initial greeting with exception: {str(e)}"
        }


async def generate_student_response(user_message: str, topic: str, user_id: str) -> Dict[str, Any]:
    """Generate AI student response using CoT and Few-Shot prompting with conversation history."""
    from openai import AsyncOpenAI
    from .prompts import get_student_prompt
    
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key or api_key == "replace-me" or api_key == "your-openai-api-key-here":
        # Realistic fallback logic
        return {
            "question": f"Interesting point about {topic}. Can you explain it more simply with an example?",
            "score": 25,  # Changed from 30 to be more generous
            "reasoning": "Fallback mode: No API key provided."
        }
    
    try:
        client = AsyncOpenAI(api_key=api_key)
        
        # Build conversation history
        messages = [{"role": "system", "content": get_student_prompt(topic)}]
        
        # Add conversation history (last 6 messages to keep context manageable)
        history = conversation_history[user_id][-6:]
        for msg in history:
            messages.append(msg)
        
        # Add current teacher message
        messages.append({"role": "user", "content": f"The teacher says: '{user_message}'"})
        
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=messages,
            response_format={"type": "json_object"},
            max_tokens=500,
            temperature=0.3  # Slightly higher for more natural responses
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Store in conversation history
        conversation_history[user_id].append({"role": "user", "content": f"The teacher says: '{user_message}'"})
        conversation_history[user_id].append({"role": "assistant", "content": response.choices[0].message.content})
        
        # Limit history size (keep last 20 messages)
        if len(conversation_history[user_id]) > 20:
            conversation_history[user_id] = conversation_history[user_id][-20:]
        
        return {
            "question": result.get("question", "I'm not sure if I followed that. Can you rephrase?"),
            "score": max(0, min(100, result.get("confusion_score", 30))),  # Clamp between 0-100
            "reasoning": result.get("reasoning", "")
        }
    except json.JSONDecodeError as e:
        print(f"AI Engine JSON Error: {e}", flush=True)
        print(f"Raw response: {response.choices[0].message.content if 'response' in locals() else 'N/A'}", flush=True)
        return {
            "question": "I'm having trouble processing that. Could you rephrase it?",
            "score": 35,
            "reasoning": f"JSON parsing error: {str(e)}"
        }
    except Exception as e:
        print(f"AI Engine Error: {e}", flush=True)
        return {
            "question": "That's interesting, but I need more details. Could you elaborate?",
            "score": 30,
            "reasoning": f"Exception: {str(e)}"
        }


async def process_chat_event(producer: AIOKafkaProducer, event: Dict[str, Any]) -> None:
    user_message = event.get("message", "")
    user_id = event.get("userId")
    timestamp = event.get("timestamp")
    topic = event.get("topic", "Computer Science")
    is_initial = event.get("isInitial", False)  # Flag for initial greeting

    # Handle initial greeting
    if is_initial or user_message.strip().upper() == "[INITIAL_GREETING]":
        ai_data = await generate_initial_greeting(topic)
        # Clear conversation history for new session
        conversation_history[user_id] = []
    else:
        # Generate response with conversation history
        ai_data = await generate_student_response(user_message, topic, user_id)
    
    # 1. Send Question
    await producer.send_and_wait(
        CHAT_OUTPUT_TOPIC,
        json.dumps({
            "userId": user_id,
            "question": ai_data["question"],
            "origin": SERVICE_ID,
            "timestamp": timestamp,
            "reasoning": ai_data["reasoning"]
        }).encode("utf-8"),
    )

    # 2. Send Score
    await producer.send_and_wait(
        CHAT_SCORE_TOPIC,
        json.dumps({
            "userId": user_id,
            "score": ai_data["score"],
            "origin": SERVICE_ID,
            "timestamp": timestamp,
        }).encode("utf-8"),
    )


async def main() -> None:
    consumer = AIOKafkaConsumer(
        CHAT_INPUT_TOPIC,
        bootstrap_servers=KAFKA_BROKERS,
        group_id=f"{SERVICE_ID}-consumer",
    )
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BROKERS)

    await consumer.start()
    await producer.start()
    
    print(f"AI Engine started. Listening on topic: {CHAT_INPUT_TOPIC}", flush=True)
    
    try:
        async for message in consumer:
            event = json.loads(message.value.decode("utf-8"))
            asyncio.create_task(process_chat_event(producer, event))
    finally:
        await consumer.stop()
        await producer.stop()


if __name__ == "__main__":
    asyncio.run(main())
