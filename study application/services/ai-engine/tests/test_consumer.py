import pytest
from app.consumer import mock_score, generate_persona_question


class TestMockScore:
    """Test the mock scoring function."""

    def test_mock_score_returns_int(self):
        """Test that mock_score returns an integer."""
        result = mock_score("test message")
        assert isinstance(result, int)

    def test_mock_score_range(self):
        """Test that mock_score returns value in valid range."""
        result = mock_score("test message")
        assert 0 <= result < 100

    def test_mock_score_consistency(self):
        """Test that same input produces same output."""
        message = "consistent test message"
        result1 = mock_score(message)
        result2 = mock_score(message)
        assert result1 == result2

    def test_mock_score_different_inputs(self):
        """Test that different inputs can produce different outputs."""
        # This test may occasionally fail due to hash collisions
        # but should pass most of the time
        messages = [f"message_{i}" for i in range(10)]
        scores = [mock_score(msg) for msg in messages]
        # At least some scores should be different
        assert len(set(scores)) > 1


@pytest.mark.asyncio
class TestGeneratePersonaQuestion:
    """Test the persona question generation."""

    async def test_returns_string(self):
        """Test that function returns a string."""
        result = await generate_persona_question("test message")
        assert isinstance(result, str)

    async def test_contains_snippet(self):
        """Test that response contains snippet of input."""
        message = "This is a test message for AI"
        result = await generate_persona_question(message)
        # Should contain first 24 chars or less
        snippet = message[:24]
        assert snippet in result or message in result

    async def test_long_message_truncation(self):
        """Test that long messages are truncated in response."""
        long_message = "a" * 100
        result = await generate_persona_question(long_message)
        # Should contain ellipsis for truncated messages
        assert "..." in result

    async def test_short_message_no_truncation(self):
        """Test that short messages are not truncated."""
        short_message = "short"
        result = await generate_persona_question(short_message)
        # Should not contain ellipsis
        assert "..." not in result

    async def test_alternating_personas(self):
        """Test that personas alternate based on message length."""
        # Even length message should use FULLSTACK_PERSONA
        even_message = "ab"
        result_even = await generate_persona_question(even_message)
        
        # Odd length message should use ML_PERSONA
        odd_message = "abc"
        result_odd = await generate_persona_question(odd_message)
        
        # Results should be different (different personas)
        assert result_even != result_odd


class TestProcessChatEvent:
    """Test the chat event processing."""

    @pytest.mark.asyncio
    async def test_process_chat_event_structure(self):
        """Test that process_chat_event handles event structure correctly."""
        from unittest.mock import AsyncMock, MagicMock
        from app.consumer import process_chat_event

        mock_producer = AsyncMock()
        mock_producer.send_and_wait = AsyncMock()

        event = {
            "userId": "test_user",
            "message": "test message",
            "timestamp": "2024-01-01T00:00:00Z",
        }

        await process_chat_event(mock_producer, event)

        # Should have been called twice (output and score)
        assert mock_producer.send_and_wait.call_count == 2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
