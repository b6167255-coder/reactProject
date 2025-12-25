import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTicket, getPriorities } from '../services/api.service';
import '../css/CreateTicketPage.css';

interface Priority {
  id: number;
  name: string;
}

const CreateTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priorityId, setPriorityId] = useState<number>(1);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        if (!state.token) return;
        const data = await getPriorities(state.token);
        setPriorities(data);
        if (data.length > 0) {
          setPriorityId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load priorities:', err);
      }
    };

    fetchPriorities();
  }, [state.token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (!state.token) {
        setError('You must be logged in');
        return;
      }

      await createTicket(state.token, {
        subject: subject.trim(),
        description: description.trim(),
        priority_id: priorityId,
      });

      navigate('/tickets');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create ticket';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-card">
        <h1>Create New Ticket</h1>
        <p className="subtitle">Submit a new support request</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your issue"
              rows={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priorityId}
              onChange={(e) => setPriorityId(Number(e.target.value))}
              disabled={loading}
            >
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;