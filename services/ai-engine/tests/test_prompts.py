import pytest
from app.prompts import FULLSTACK_PERSONA, ML_PERSONA


class TestPrompts:
    """Test the persona prompts."""

    def test_fullstack_persona_exists(self):
        """Test that FULLSTACK_PERSONA is defined."""
        assert FULLSTACK_PERSONA is not None
        assert isinstance(FULLSTACK_PERSONA, str)
        assert len(FULLSTACK_PERSONA) > 0

    def test_ml_persona_exists(self):
        """Test that ML_PERSONA is defined."""
        assert ML_PERSONA is not None
        assert isinstance(ML_PERSONA, str)
        assert len(ML_PERSONA) > 0

    def test_personas_are_different(self):
        """Test that the two personas are different."""
        assert FULLSTACK_PERSONA != ML_PERSONA

    def test_fullstack_persona_content(self):
        """Test that FULLSTACK_PERSONA contains expected content."""
        assert "Jason" in FULLSTACK_PERSONA
        assert "React" in FULLSTACK_PERSONA.lower() or "react" in FULLSTACK_PERSONA

    def test_ml_persona_content(self):
        """Test that ML_PERSONA contains expected content."""
        assert "Pat" in ML_PERSONA
        assert "Product Manager" in ML_PERSONA


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
