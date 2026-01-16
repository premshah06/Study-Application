import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setTopic, startSession } from '../store/chatSlice';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { TOPIC_CATEGORIES } from '../constants/topics';

export const TopicDiscoveryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { sendMessage } = useSocket(token);

    const handleStartSession = (topic: string) => {
        dispatch(setTopic(topic));
        dispatch(startSession());
        sendMessage(`Let's start. I want to teach you about ${topic}.`);
        navigate(`/teach/${encodeURIComponent(topic)}`);
    };

    return (
        <div className="discovery-container">
            <header className="discovery-header">
                <h1>Mastery Paths</h1>
                <p>Choose a discipline to begin your teaching journey.</p>
            </header>

            <div className="category-list">
                {TOPIC_CATEGORIES.map(category => (
                    <section key={category.name} className="category-section">
                        <h2 className="category-title">{category.name}</h2>
                        <div className="topic-grid">
                            {category.topics.map(topic => (
                                <div
                                    key={topic}
                                    className="topic-card-large"
                                    onClick={() => handleStartSession(topic)}
                                >
                                    <div className="topic-icon">{topic[0]}</div>
                                    <div className="topic-info">
                                        <h3>{topic}</h3>
                                        <span>Click to start teaching</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};
