import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLeaderboard, setHistory, setSummary } from '../store/chatSlice';
import { useAuth } from '../hooks/useAuth';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token, userId } = useAuth();
    const { leaderboard, history, summary } = useAppSelector(state => state.chat);

    const fetchStats = useCallback(async () => {
        if (!token) return;
        try {
            const lbRes = await fetch(`${GATEWAY_URL}/api/stats/leaderboard`);
            if (lbRes.ok) dispatch(setLeaderboard(await lbRes.json()));

            const histRes = await fetch(`${GATEWAY_URL}/api/stats/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (histRes.ok) dispatch(setHistory(await histRes.json()));

            const sumRes = await fetch(`${GATEWAY_URL}/api/stats/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (sumRes.ok) dispatch(setSummary(await sumRes.json()));
        } catch (err) {
            console.error("Stats fetch error:", err);
        }
    }, [token, dispatch]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="welcome-text">
                    <h1>Welcome back, {userId}</h1>
                    <p>Your journey to mastery continues.</p>
                </div>
                <button className="btn-primary-large" onClick={() => navigate('/topics')}>
                    Start New Session
                </button>
            </header>

            <div className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-label">Total Sessions</span>
                    <span className="metric-value">{summary?.totalSessions || 0}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Best Level</span>
                    <span className="metric-value">Level {Math.floor((summary?.bestStreak || 0) / 30) + 1}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Study Time</span>
                    <span className="metric-value">{Math.round((summary?.totalDuration || 0) / 60)}m</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Avg. Focus</span>
                    <span className="metric-value">{summary?.avgDuration || 0}s</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card history-card">
                    <h2>Learning History</h2>
                    <div className="history-list">
                        {history.length === 0 ? (
                            <p className="empty-msg">No sessions recorded yet. Start your first lesson!</p>
                        ) : (
                            history.map((item, idx) => (
                                <div key={idx} className="history-item">
                                    <div className="history-info">
                                        <h3>{item.topic}</h3>
                                        <span>{new Date(item.endedAt).toLocaleDateString()} at {new Date(item.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="history-meta">
                                        <span className="history-duration">{item.duration}s</span>
                                        <div className="history-status">Mastered</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="dashboard-card leaderboard-card">
                    <h2>Global Rankings</h2>
                    <div className="leaderboard-list">
                        {leaderboard.slice(0, 5).map((user, idx) => (
                            <div key={idx} className={`leader-item ${user.userId === userId ? 'is-self' : ''}`}>
                                <span className="leader-rank">{idx + 1}</span>
                                <span className="leader-name">{user.userId}</span>
                                <span className="leader-level">Lvl {Math.floor(user.bestStreak / 30) + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
