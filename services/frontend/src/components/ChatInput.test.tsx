import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../components/ChatInput";

describe("ChatInput Component", () => {
    it("should render input field and send button", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} />);

        expect(
            screen.getByPlaceholderText("Teach the AI student something...")
        ).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should call onSendMessage when form is submitted", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} />);

        const input = screen.getByPlaceholderText("Teach the AI student something...");
        const form = input.closest("form");

        fireEvent.change(input, { target: { value: "Test message" } });
        fireEvent.submit(form!);

        expect(mockOnSend).toHaveBeenCalledWith("Test message");
    });

    it("should clear input after sending message", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} />);

        const input = screen.getByPlaceholderText(
            "Teach the AI student something..."
        ) as HTMLInputElement;
        const form = input.closest("form");

        fireEvent.change(input, { target: { value: "Test message" } });
        fireEvent.submit(form!);

        expect(input.value).toBe("");
    });

    it("should not send empty messages", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} />);

        const input = screen.getByPlaceholderText("Teach the AI student something...");
        const form = input.closest("form");

        fireEvent.change(input, { target: { value: "   " } });
        fireEvent.submit(form!);

        expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("should disable input when disabled prop is true", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} disabled={true} />);

        const input = screen.getByPlaceholderText("Connecting...");
        expect(input).toBeDisabled();
    });

    it("should trim whitespace from messages", () => {
        const mockOnSend = vi.fn();
        render(<ChatInput onSendMessage={mockOnSend} />);

        const input = screen.getByPlaceholderText("Teach the AI student something...");
        const form = input.closest("form");

        fireEvent.change(input, { target: { value: "  Test message  " } });
        fireEvent.submit(form!);

        expect(mockOnSend).toHaveBeenCalledWith("Test message");
    });
});
