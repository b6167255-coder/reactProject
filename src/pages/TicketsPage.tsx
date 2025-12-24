import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/api.service';
import '../css/TicketsPage.css';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status_id: number;
  status_name?: string;
  priority_id: number;
  priority_name?: string;
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!state.token) return;

        setLoading(true);
        const data = await getTickets(state.token);
        setTickets(data);
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [state.token]);

  const handleTicketClick = (ticketId: number) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNewTicket = () => {
    navigate('/tickets/new');
  };

  if (loading) {
    return (
      <div className="tickets-container">
        <div className="loading">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <header className="tickets-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>My Tickets</h1>
        </div>
        {state.user?.role === 'customer' && (
          <button onClick={handleNewTicket} className="new-ticket-btn">
            + New Ticket
          </button>
        )}
      </header>

      <main className="tickets-content">
        {error && <div className="error-message">{error}</div>}

        {tickets.length === 0 ? (
          <div className="no-tickets">
            <p>No tickets found</p>
            {state.user?.role === 'customer' && (
              <button onClick={handleNewTicket} className="create-first-btn">
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <div className="ticket-header-row">
                  <h3>#{ticket.id} - {ticket.subject}</h3>
                  <span className={`priority-badge priority-${ticket.priority_id}`}>
                    {ticket.priority_name || 'Priority ' + ticket.priority_id}
                  </span>
                </div>

                <p className="ticket-description">{ticket.description}</p>

                <div className="ticket-footer">
                  <span className={`status-badge status-${ticket.status_id}`}>
                    {ticket.status_name || 'Status ' + ticket.status_id}
                  </span>
                  <span className="ticket-date">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketsPage;