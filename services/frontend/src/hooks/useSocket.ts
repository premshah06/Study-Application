import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMessage, setConfusionScore } from "../store/chatSlice";

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

export const useSocket = (token: string | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useAppDispatch();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const newSocket = io(GATEWAY_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        newSocket.on("message:receive", (event: any) => {
            dispatch(
                addMessage({
                    id: `ai-${Date.now()}`,
                    role: "ai",
                    content: event.question,
                    timestamp: event.timestamp,
                })
            );
        });

        newSocket.on("message:score", (event: any) => {
            dispatch(setConfusionScore(event.score));
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token, dispatch]);

    const { selectedTopic } = useAppSelector((state) => state.chat);

    const sendMessage = (message: string) => {
        if (socket && isConnected) {
            socket.emit("message:send", { message, topic: selectedTopic });
            dispatch(
                addMessage({
                    id: `user-${Date.now()}`,
                    role: "user",
                    content: message,
                    timestamp: new Date().toISOString(),
                })
            );
        }
    };

    const sendInitialGreeting = (topic: string) => {
        if (socket && isConnected) {
            socket.emit("message:send", {
                message: "[INITIAL_GREETING]",
                topic,
                isInitial: true
            });
        }
    };

    return { socket, isConnected, sendMessage, sendInitialGreeting };
};
