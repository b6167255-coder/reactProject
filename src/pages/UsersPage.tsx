import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api.service';
import '../css/UsersPage.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!state.token) return;

        setLoading(true);
        const data = await getUsers(state.token);
        setUsers(data);
        setError('');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load users';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [state.token]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCreateUser = () => {
    navigate('/users/new');
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <header className="users-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Users Management</h1>
        </div>
        <button onClick={handleCreateUser} className="new-user-btn">
          + Add New User
        </button>
      </header>

      <main className="users-content">
        {error && <div className="error-message">{error}</div>}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.is_active ? 'active' : 'inactive'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UsersPage;