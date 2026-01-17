import React, { useState } from "react";

interface LoginFormProps {
    onLogin: (userId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onLogin,
    isLoading,
    error,
}) => {
    const [userId, setUserId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId.trim()) {
            await onLogin(userId.trim());
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>WeStudy</h1>
                    <p className="login-tagline">Learn topics by teaching them.</p>
                    <p className="login-description">
                        The ultimate way to master any subject. Our AI student is ready to listen.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="userId">Enter your username</label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="teacher_name"
                            disabled={isLoading}
                            className="login-input"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message" style={{ color: 'var(--error)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading || !userId.trim()}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                    >
                        {isLoading ? "Connecting..." : "Start Teaching"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Enter any name to save your progress and compete on the leaderboard.</p>
                </div>
            </div>
        </div>
    );
};
