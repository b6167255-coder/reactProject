import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardPage = () => {
  const { state } = useAuth();
  const { user } = state;

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'customer':
      return <CustomerDashboard />;
    case 'agent':
      return <AgentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export default DashboardPage;