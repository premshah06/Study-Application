import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import { ChatMessage } from "./ChatMessage";

export const ChatWindow: React.FC = () => {
    const messages = useAppSelector((state) => state.chat.messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-window">
            {messages.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Ready to teach?
                    </h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-muted)' }}>
                        Start by selecting a topic and explaining it in simple terms.
                        Your goal is to keep the AI's confusion level below 45%.
                    </p>
                </div>
            ) : (
                <div className="messages-container">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
