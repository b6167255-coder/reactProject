import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

const AdminDashboard = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {state.user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card admin">
          <h2>Admin Control Panel</h2>
          <p>Manage all tickets, users, and system settings.</p>
        </div>

        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/tickets')}>
            <h3>🎫 All Tickets</h3>
            <p>View and manage all tickets</p>
          </div>

          <div className="action-card">
            <h3>👥 Users</h3>
            <p>Manage users and agents</p>
          </div>

          <div className="action-card">
            <h3>⚙️ Settings</h3>
            <p>Manage statuses and priorities</p>
          </div>

          <div className="action-card">
            <h3>📊 Reports</h3>
            <p>View system statistics</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;