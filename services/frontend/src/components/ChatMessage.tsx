import React from "react";
import { ChatMessage as ChatMessageType } from "../store/chatSlice";

interface ChatMessageProps {
    message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === "user";

    return (
        <div
            className={`message-container ${isUser ? "user-message" : "ai-message"}`}
        >
            <div className="message-bubble">
                <div className="message-header">
                    <span className="message-role">
                        {isUser ? "You" : "AI Student"}
                    </span>
                    <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div className="message-content">{message.content}</div>
            </div>
        </div>
    );
};
