import { describe, it, expect } from "vitest";
import chatReducer, {
    addMessage,
    setConfusionScore,
    resetChat,
    ChatState,
} from "../store/chatSlice";

describe("Chat Slice", () => {
    const initialState: ChatState = {
        messages: [],
        confusionScore: 0,
    };

    it("should return initial state", () => {
        expect(chatReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle addMessage", () => {
        const message = {
            id: "1",
            role: "user" as const,
            content: "Hello",
            timestamp: new Date().toISOString(),
        };

        const actual = chatReducer(initialState, addMessage(message));

        expect(actual.messages).toHaveLength(1);
        expect(actual.messages[0]).toEqual(message);
    });

    it("should handle multiple addMessage calls", () => {
        const message1 = {
            id: "1",
            role: "user" as const,
            content: "Hello",
            timestamp: new Date().toISOString(),
        };

        const message2 = {
            id: "2",
            role: "ai" as const,
            content: "Hi there",
            timestamp: new Date().toISOString(),
        };

        let state = chatReducer(initialState, addMessage(message1));
        state = chatReducer(state, addMessage(message2));

        expect(state.messages).toHaveLength(2);
        expect(state.messages[0]).toEqual(message1);
        expect(state.messages[1]).toEqual(message2);
    });

    it("should handle setConfusionScore", () => {
        const actual = chatReducer(initialState, setConfusionScore(75));

        expect(actual.confusionScore).toBe(75);
    });

    it("should handle resetChat", () => {
        const stateWithData: ChatState = {
            messages: [
                {
                    id: "1",
                    role: "user",
                    content: "Test",
                    timestamp: new Date().toISOString(),
                },
            ],
            confusionScore: 50,
        };

        const actual = chatReducer(stateWithData, resetChat());

        expect(actual).toEqual(initialState);
    });

    it("should preserve other state when adding message", () => {
        const stateWithScore: ChatState = {
            messages: [],
            confusionScore: 42,
        };

        const message = {
            id: "1",
            role: "user" as const,
            content: "Hello",
            timestamp: new Date().toISOString(),
        };

        const actual = chatReducer(stateWithScore, addMessage(message));

        expect(actual.confusionScore).toBe(42);
        expect(actual.messages).toHaveLength(1);
    });

    it("should preserve messages when setting confusion score", () => {
        const stateWithMessages: ChatState = {
            messages: [
                {
                    id: "1",
                    role: "user",
                    content: "Test",
                    timestamp: new Date().toISOString(),
                },
            ],
            confusionScore: 0,
        };

        const actual = chatReducer(stateWithMessages, setConfusionScore(30));

        expect(actual.messages).toHaveLength(1);
        expect(actual.confusionScore).toBe(30);
    });
});
