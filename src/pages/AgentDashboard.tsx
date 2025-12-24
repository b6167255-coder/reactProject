import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

const AgentDashboard = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Agent Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {state.user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card agent">
          <h2>Agent Portal</h2>
          <p>Manage and respond to assigned tickets.</p>
        </div>

        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/tickets')}>
            <h3>🎫 Assigned Tickets</h3>
            <p>View tickets assigned to you</p>
          </div>

          <div className="action-card">
            <h3>📊 Statistics</h3>
            <p>View your performance</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;