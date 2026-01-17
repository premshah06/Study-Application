#!/usr/bin/env python3
"""
Test script to verify AI chat responses
Sends test messages and captures AI student responses
"""

import asyncio
import json
import sys
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
import time

KAFKA_BROKERS = "localhost:9092"
CHAT_INPUT_TOPIC = "chat.input"
CHAT_OUTPUT_TOPIC = "chat.output"
CHAT_SCORE_TOPIC = "chat.score"

test_messages = [
    {
        "id": 1,
        "message": "LLM stands for Large Language Model",
        "expected_keywords": ["large", "language", "model", "what", "how"],
        "persona": "Jason (even length)"
    },
    {
        "id": 2,
        "message": "Neural networks learn patterns from data",
        "expected_keywords": ["neural", "network", "pattern", "learn", "data"],
        "persona": "Pat (odd length)"
    },
    {
        "id": 3,
        "message": "Transformers use attention mechanisms to process sequences",
        "expected_keywords": ["transformer", "attention", "sequence", "process"],
        "persona": "Jason (even length)"
    },
    {
        "id": 4,
        "message": "AI models require GPU acceleration for training",
        "expected_keywords": ["gpu", "training", "model", "acceleration"],
        "persona": "Pat (odd length)"
    },
    {
        "id": 5,
        "message": "Backpropagation adjusts weights to minimize loss",
        "expected_keywords": ["backpropagation", "weight", "loss", "minimize"],
        "persona": "Jason (even length)"
    }
]

async def produce_message(producer, msg_id, message):
    """Send a test message to Kafka"""
    event = {
        "userId": f"test-user-{msg_id}",
        "message": message,
        "timestamp": int(time.time() * 1000)
    }
    
    await producer.send_and_wait(
        CHAT_INPUT_TOPIC,
        json.dumps(event).encode('utf-8')
    )
    print(f"✅ Sent message {msg_id}: '{message[:50]}...'")
    return event

async def consume_responses(timeout=10):
    """Listen for AI responses"""
    consumer = AIOKafkaConsumer(
        CHAT_OUTPUT_TOPIC,
        CHAT_SCORE_TOPIC,
        bootstrap_servers=KAFKA_BROKERS,
        auto_offset_reset='latest',
        group_id=f'test-consumer-{int(time.time())}'
    )
    
    await consumer.start()
    responses = []
    scores = []
    
    try:
        print(f"\n📡 Listening for responses (timeout: {timeout}s)...")
        start_time = time.time()
        
        async for msg in consumer:
            if time.time() - start_time > timeout:
                break
                
            data = json.loads(msg.value.decode('utf-8'))
            
            if msg.topic == CHAT_OUTPUT_TOPIC:
                responses.append(data)
                print(f"💬 AI Response: {data.get('question', 'N/A')[:80]}...")
            elif msg.topic == CHAT_SCORE_TOPIC:
                scores.append(data)
                print(f"📊 Confusion Score: {data.get('score', 'N/A')}")
                
    finally:
        await consumer.stop()
    
    return responses, scores

async def run_tests():
    """Run all prompt tests"""
    print("=" * 80)
    print("🧪 PROMPT TESTING - Study Application")
    print("=" * 80)
    print(f"\nKafka Brokers: {KAFKA_BROKERS}")
    print(f"Input Topic: {CHAT_INPUT_TOPIC}")
    print(f"Output Topic: {CHAT_OUTPUT_TOPIC}")
    print(f"Score Topic: {CHAT_SCORE_TOPIC}")
    print(f"\nTotal Test Messages: {len(test_messages)}\n")
    
    # Create producer
    producer = AIOKafkaProducer(
        bootstrap_servers=KAFKA_BROKERS,
        value_serializer=lambda v: v
    )
    await producer.start()
    
    # Start consumer in background
    consumer_task = asyncio.create_task(consume_responses(timeout=15))
    
    # Wait a bit for consumer to be ready
    await asyncio.sleep(2)
    
    # Send all test messages
    print("\n" + "=" * 80)
    print("📤 SENDING TEST MESSAGES")
    print("=" * 80 + "\n")
    
    for test in test_messages:
        await produce_message(producer, test["id"], test["message"])
        await asyncio.sleep(1)  # Small delay between messages
    
    await producer.stop()
    
    # Wait for responses
    print("\n" + "=" * 80)
    print("📥 COLLECTING RESPONSES")
    print("=" * 80)
    
    responses, scores = await consumer_task
    
    # Analyze results
    print("\n" + "=" * 80)
    print("📊 TEST RESULTS")
    print("=" * 80 + "\n")
    
    print(f"Messages Sent: {len(test_messages)}")
    print(f"Responses Received: {len(responses)}")
    print(f"Scores Received: {len(scores)}")
    
    if responses:
        print("\n" + "-" * 80)
        print("AI RESPONSES ANALYSIS")
        print("-" * 80 + "\n")
        
        for i, response in enumerate(responses, 1):
            question = response.get('question', 'N/A')
            print(f"{i}. {question}")
            print()
    
    if scores:
        print("-" * 80)
        print("CONFUSION SCORES")
        print("-" * 80 + "\n")
        
        for i, score_data in enumerate(scores, 1):
            score = score_data.get('score', 'N/A')
            print(f"{i}. Score: {score}")
    
    # Summary
    print("\n" + "=" * 80)
    print("✅ TEST SUMMARY")
    print("=" * 80 + "\n")
    
    success_rate = (len(responses) / len(test_messages) * 100) if test_messages else 0
    print(f"Success Rate: {success_rate:.1f}%")
    print(f"Total Messages: {len(test_messages)}")
    print(f"Responses: {len(responses)}")
    print(f"Scores: {len(scores)}")
    
    if success_rate >= 80:
        print("\n🎉 TESTS PASSED - AI is responding to prompts!")
    else:
        print("\n⚠️  TESTS INCOMPLETE - Some responses missing")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    try:
        asyncio.run(run_tests())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
