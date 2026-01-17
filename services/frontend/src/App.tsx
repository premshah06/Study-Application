import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/LoginForm";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { TopicDiscoveryPage } from "./pages/TopicDiscoveryPage";
import { TeachingPage } from "./pages/TeachingPage";

const App: React.FC = () => {
    const { token, login, isLoading, error } = useAuth();

    if (!token) {
        return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
    }

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/topics" element={<TopicDiscoveryPage />} />
                <Route path="/teach/:topic" element={<TeachingPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
};

export default App;
