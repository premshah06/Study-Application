import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    tickStreak,
    endSession,
    setResponseDeadline,
    setLeaderboard,
    setHistory,
    resetChat,
    startSession,
    setTopic
} from '../store/chatSlice';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { ConfusionMeter } from '../components/ConfusionMeter';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

export const TeachingPage: React.FC = () => {
    const { topic } = useParams<{ topic: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useAuth();
    const { isConnected, sendMessage, sendInitialGreeting } = useSocket(token);

    const {
        currentStreak, sessionStatus,
        selectedTopic, responseDeadline, confusionScore
    } = useAppSelector(state => state.chat);

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const fetchStats = useCallback(async () => {
        if (!token) return;
        try {
            const lbRes = await fetch(`${GATEWAY_URL}/api/stats/leaderboard`);
            if (lbRes.ok) dispatch(setLeaderboard(await lbRes.json()));

            const histRes = await fetch(`${GATEWAY_URL}/api/stats/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (histRes.ok) dispatch(setHistory(await histRes.json()));
        } catch (err) {
            console.error("Stats fetch error:", err);
        }
    }, [token, dispatch]);

    const handleEndSession = useCallback(async (reason?: string) => {
        if (sessionStatus !== 'active') return;

        if (reason) alert(reason);
        dispatch(endSession());

        if (token && currentStreak > 2) {
            try {
                await fetch(`${GATEWAY_URL}/api/stats/streak`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ duration: currentStreak, topic: selectedTopic }),
                });
                fetchStats();
            } catch (err) {
                console.error("Save streak error:", err);
            }
        }
    }, [sessionStatus, token, currentStreak, selectedTopic, dispatch, fetchStats]);

    // Timers
    useEffect(() => {
        let timer: any;
        if (sessionStatus === 'active') {
            timer = setInterval(() => {
                dispatch(tickStreak());
                if (responseDeadline) {
                    const remaining = Math.max(0, Math.floor((new Date(responseDeadline).getTime() - Date.now()) / 1000));
                    setTimeLeft(remaining);
                    if (remaining === 0) {
                        handleEndSession("Time's up! You took too long to respond.");
                    }
                } else {
                    setTimeLeft(null);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [sessionStatus, responseDeadline, dispatch, handleEndSession]);

    // Auto-end
    useEffect(() => {
        if (sessionStatus === 'active' && confusionScore >= 45) {
            handleEndSession("The AI student is too confused. Practice simplifying your explanation.");
        }
    }, [confusionScore, sessionStatus, handleEndSession]);

    if (!selectedTopic || selectedTopic !== topic) {
        return (
            <div className="status-container">
                <p>Initializing session for {topic}...</p>
                <button className="btn-primary" onClick={() => {
                    dispatch(setTopic(topic!));
                    dispatch(startSession());
                    sendInitialGreeting(topic!);
                }}>Confirm Start</button>
            </div>
        );
    }

    return (
        <div className="teaching-layout">
            <div className="chat-main">
                <header className="chat-header" style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(to bottom, #ffffff, #f9fafb)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Teaching Session</h2>
                            <span className="live-indicator" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--success)', background: '#def7ec', padding: '0.15rem 0.6rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <span style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                                Live
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Currently teaching: <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{selectedTopic}</span></p>
                    </div>
                </header>

                <ChatWindow />

                {sessionStatus === 'ended' ? (
                    <div className="session-ended-navbar">
                        <div style={{ marginRight: 'auto', fontSize: '0.875rem', fontWeight: 600 }}>
                            Session Summary
                        </div>
                        <button className="btn-secondary" onClick={() => navigate('/topics')}>New Subject</button>
                        <button className="btn-primary" onClick={() => {
                            dispatch(startSession());
                            sendInitialGreeting(selectedTopic!);
                        }}>Restart Session</button>
                    </div>
                ) : (
                    <ChatInput
                        onSendMessage={(msg) => {
                            sendMessage(msg);
                            dispatch(setResponseDeadline(null));
                        }}
                        disabled={!isConnected || sessionStatus !== 'active'}
                        timeLeft={timeLeft}
                    />
                )}
            </div>

            <aside className="teaching-sidebar">
                <div className="panel-card dark-panel">
                    <h3 className="panel-title">Active Mastery</h3>
                    <div className="mastery-level-large">Level {Math.floor(currentStreak / 30) + 1}</div>
                    <p className="topic-badge">{selectedTopic}</p>
                </div>

                <ConfusionMeter />

                <div className="info-card">
                    <h4>Teaching Tip</h4>
                    <p>Use analogies and break down complex terms. Avoid jargon without defining it first.</p>
                </div>
            </aside>
        </div >
    );
};
