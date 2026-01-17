import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatMessage } from "../components/ChatMessage";
import { ChatMessage as ChatMessageType } from "../store/chatSlice";

describe("ChatMessage Component", () => {
    it("should render user message correctly", () => {
        const message: ChatMessageType = {
            id: "1",
            role: "user",
            content: "Hello, AI!",
            timestamp: new Date().toISOString(),
        };

        render(<ChatMessage message={message} />);

        expect(screen.getByText("You")).toBeInTheDocument();
        expect(screen.getByText("Hello, AI!")).toBeInTheDocument();
    });

    it("should render AI message correctly", () => {
        const message: ChatMessageType = {
            id: "2",
            role: "ai",
            content: "Can you explain that?",
            timestamp: new Date().toISOString(),
        };

        render(<ChatMessage message={message} />);

        expect(screen.getByText("AI Student")).toBeInTheDocument();
        expect(screen.getByText("Can you explain that?")).toBeInTheDocument();
    });

    it("should apply correct CSS class for user message", () => {
        const message: ChatMessageType = {
            id: "1",
            role: "user",
            content: "Test",
            timestamp: new Date().toISOString(),
        };

        const { container } = render(<ChatMessage message={message} />);
        const messageContainer = container.querySelector(".message-container");

        expect(messageContainer).toHaveClass("user-message");
    });

    it("should apply correct CSS class for AI message", () => {
        const message: ChatMessageType = {
            id: "2",
            role: "ai",
            content: "Test",
            timestamp: new Date().toISOString(),
        };

        const { container } = render(<ChatMessage message={message} />);
        const messageContainer = container.querySelector(".message-container");

        expect(messageContainer).toHaveClass("ai-message");
    });
});
