import React from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useAppDispatch } from '../store/hooks';
import { resetChat } from '../store/chatSlice';
import { Outlet, useNavigate } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    const { token, userId, logout } = useAuth();
    const { isConnected } = useSocket(token);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(resetChat());
        logout();
    };

    return (
        <div className="app">
            <Header userId={userId} isConnected={isConnected} onLogout={handleLogout} />
            <main className="main-content-fluid">
                <Outlet />
            </main>
        </div>
    );
};
