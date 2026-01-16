#!/bin/bash

# Prompt Testing Script for Study Application
# Tests AI responses by monitoring Kafka topics

echo "================================================================================"
echo "🧪 PROMPT TESTING - Study Application"
echo "================================================================================"
echo ""
echo "This test will:"
echo "1. Send test messages to Kafka"
echo "2. Monitor AI Engine responses"
echo "3. Capture confusion scores"
echo ""

# Test messages
declare -a TEST_MESSAGES=(
    "LLM stands for Large Language Model"
    "Neural networks learn patterns from data"
    "Transformers use attention mechanisms"
    "AI models require GPU for training"
    "Backpropagation adjusts weights to minimize loss"
)

echo "Total Test Messages: ${#TEST_MESSAGES[@]}"
echo ""
echo "================================================================================"
echo "📤 SENDING TEST MESSAGES TO KAFKA"
echo "================================================================================"
echo ""

# Send messages to Kafka
for i in "${!TEST_MESSAGES[@]}"; do
    MSG_NUM=$((i+1))
    MESSAGE="${TEST_MESSAGES[$i]}"
    
    echo "Message $MSG_NUM: \"$MESSAGE\""
    
    # Create JSON payload
    TIMESTAMP=$(date +%s)000
    JSON_PAYLOAD=$(cat <<EOF
{
  "userId": "test-user-$MSG_NUM",
  "message": "$MESSAGE",
  "timestamp": $TIMESTAMP
}
EOF
)
    
    # Send to Kafka using docker exec
    echo "$JSON_PAYLOAD" | docker compose -f infrastructure/docker-compose.yml exec -T kafka \
        kafka-console-producer \
        --bootstrap-server localhost:9092 \
        --topic chat.input \
        2>/dev/null
    
    echo "✅ Sent"
    echo ""
    sleep 2
done

echo "================================================================================"
echo "📥 MONITORING AI ENGINE RESPONSES"
echo "================================================================================"
echo ""
echo "Checking AI Engine logs for responses..."
echo ""

# Wait a bit for processing
sleep 3

# Check AI engine logs
docker compose -f infrastructure/docker-compose.yml logs ai-engine --tail=50 2>&1 | \
    grep -v "WARN\|version" | \
    grep -E "OpenAI|error|response|question" | \
    tail -20

echo ""
echo "================================================================================"
echo "📊 CHECKING KAFKA OUTPUT TOPICS"
echo "================================================================================"
echo ""

echo "Chat Output Topic (AI Responses):"
echo "---"
docker compose -f infrastructure/docker-compose.yml exec -T kafka \
    kafka-console-consumer \
    --bootstrap-server localhost:9092 \
    --topic chat.output \
    --from-beginning \
    --max-messages 5 \
    --timeout-ms 5000 \
    2>/dev/null | head -10

echo ""
echo "Chat Score Topic (Confusion Scores):"
echo "---"
docker compose -f infrastructure/docker-compose.yml exec -T kafka \
    kafka-console-consumer \
    --bootstrap-server localhost:9092 \
    --topic chat.score \
    --from-beginning \
    --max-messages 5 \
    --timeout-ms 5000 \
    2>/dev/null | head -10

echo ""
echo "================================================================================"
echo "✅ PROMPT TESTING COMPLETE"
echo "================================================================================"
echo ""
echo "Review the output above to verify:"
echo "1. Messages were sent to Kafka"
echo "2. AI Engine processed the messages"
echo "3. Responses were generated"
echo "4. Confusion scores were calculated"
echo ""
