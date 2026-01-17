import React, { createContext, useContext, useState, useEffect } from "react";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

interface AuthContextType {
    token: string | null;
    userId: string | null;
    isLoading: boolean;
    error: string | null;
    login: (userIdInput: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("user_id"));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (userIdInput: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${GATEWAY_URL}/api/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userIdInput }),
            });

            if (!response.ok) throw new Error("Failed to authenticate");

            const data = await response.json();
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user_id", userIdInput);
            setToken(data.token);
            setUserId(userIdInput);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        setToken(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, userId, isLoading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
