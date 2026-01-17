import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setResponseDeadline } from "../store/chatSlice";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    timeLeft: number | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    disabled = false,
    timeLeft
}) => {
    const [message, setMessage] = useState("");
    const dispatch = useAppDispatch();
    const { responseDeadline, sessionStatus } = useAppSelector(state => state.chat);

    const handleKeyDown = () => {
        // Start timer on first character if not already started
        if (sessionStatus === 'active' && !responseDeadline && !disabled) {
            const deadline = new Date(Date.now() + 60000).toISOString();
            dispatch(setResponseDeadline(deadline));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <div className="chat-input-wrapper">
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        disabled
                            ? "Current session is inactive..."
                            : "Explain the concept in your own words..."
                    }
                    disabled={disabled}
                    className="chat-input"
                    autoFocus
                />

                {timeLeft !== null && (
                    <div className="timer-subtle" style={{ width: '40px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${(timeLeft / 60) * 100}%`,
                            background: timeLeft < 10 ? 'var(--error)' : 'var(--primary-color)',
                            transition: 'width 1s linear'
                        }} />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1rem' }}
                    aria-label="Send message"
                >
                    Send
                </button>
            </form>
        </div>
    );
};
