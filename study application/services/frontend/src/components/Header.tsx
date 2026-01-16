import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
    userId: string | null;
    isConnected: boolean;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    userId,
    isConnected,
    onLogout,
}) => {
    const location = useLocation();

    return (
        <header className="app-header">
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <h1 className="app-title">WeStudy</h1>
                </Link>

                <nav className="header-nav" style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link
                        to="/dashboard"
                        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: location.pathname === '/dashboard' ? 'var(--primary-color)' : 'var(--text-secondary)',
                            transition: 'color 0.2s'
                        }}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/topics"
                        className={`nav-link ${location.pathname === '/topics' ? 'active' : ''}`}
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: location.pathname === '/topics' ? 'var(--primary-color)' : 'var(--text-secondary)',
                            transition: 'color 0.2s'
                        }}
                    >
                        Learn
                    </Link>
                </nav>
            </div>

            <div className="header-right">
                <div className="connection-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                        className="status-indicator"
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isConnected ? 'var(--success)' : 'var(--error)'
                        }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {isConnected ? "Live" : "Offline"}
                    </span>
                </div>

                {userId && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div className="user-badge">{userId}</div>
                        <button onClick={onLogout} className="btn-logout">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
