import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

const CustomerDashboard = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {state.user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to Your Helpdesk</h2>
          <p>Here you can view and manage your support tickets.</p>
        </div>

        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate('/tickets/new')}>
            <h3>📝 Create New Ticket</h3>
            <p>Submit a new support request</p>
          </div>

          <div className="action-card" onClick={() => navigate('/tickets')}>
            <h3>📋 My Tickets</h3>
            <p>View all your tickets</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;