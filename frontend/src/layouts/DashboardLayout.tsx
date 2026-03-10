import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="container dashboard-header-inner">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo-full.png" alt="Financy Logo" style={{ height: '24px' }} />
                    </div>

                    <nav className="header-nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `header-nav-item ${isActive && window.location.pathname === '/' ? 'active' : ''}`}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/transactions"
                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                        >
                            Transações
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                        >
                            Categorias
                        </NavLink>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={handleLogout} className="user-avatar" title="Sair">
                            CT
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main animate-fade-in">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
