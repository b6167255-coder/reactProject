import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {getTicket, getComments, createComment, updateTicket, getStatuses, getUsers, }from '../services/api.service';
import '../css/TicketDetailPage.css';

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

interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  author_name?: string;
  author_email?: string;
  content: string;
  created_at: string;
}

interface Status {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      if (!state.token || !id) return;

      setLoading(true);
      
      const [ticketData, commentsData, statusesData] = await Promise.all([
        getTicket(state.token, Number(id)),
        getComments(state.token, Number(id)),
        getStatuses(state.token),
      ]);

      setTicket(ticketData);
      setComments(commentsData);
      setStatuses(statusesData);

      if (state.user?.role === 'admin') {
        const usersData = await getUsers(state.token);
        const agentsList = usersData.filter(
          (user) => user.role === 'agent' || user.role === 'admin'
        );
        setAgents(agentsList);
      }

      setError('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load ticket';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [state.token, state.user?.role, id]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      if (!state.token || !id) return;

      const comment = await createComment(
        state.token,
        Number(id),
        newComment.trim()
      );

      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatusId: number) => {
    try {
      if (!state.token || !id) return;

      const updatedTicket = await updateTicket(state.token, Number(id), {
        status_id: newStatusId,
      });

      setTicket(updatedTicket);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
    }
  };

  const handleAssignAgent = async (agentId: number) => {
  try {
    if (!state.token || !id) return;

    const updatedTicket = await updateTicket(state.token, Number(id), {
      assigned_to: agentId,
    });

    setTicket(updatedTicket);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to assign agent';
    setError(errorMessage);
  }
};

  const handleBack = () => {
    navigate('/tickets');
  };

  if (loading) {
    return (
      <div className="ticket-detail-container">
        <div className="loading">Loading ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-container">
        <div className="error-message">Ticket not found</div>
      </div>
    );
  }

  const canUpdateStatus =
    state.user?.role === 'agent' || state.user?.role === 'admin';

    const isAdmin = state.user?.role === 'admin';

  return (
    <div className="ticket-detail-container">
      <header className="ticket-detail-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Tickets
        </button>
      </header>

      <main className="ticket-detail-content">
        {error && <div className="error-message">{error}</div>}

        <div className="ticket-info-card">
          <div className="ticket-header">
            <h1>
              #{ticket.id} - {ticket.subject}
            </h1>
           <div className="ticket-badges">
              <span className={`priority-badge priority-${ticket.priority_id}`}>
                {ticket.priority_name || 'Priority ' + ticket.priority_id}
              </span>
              {canUpdateStatus ? (
                <select
                  value={ticket.status_id}
                  onChange={(e) => handleStatusChange(Number(e.target.value))}
                  className="status-select"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`status-badge status-${ticket.status_id}`}>
                  {ticket.status_name || 'Status ' + ticket.status_id}
                </span>
              )}
              {isAdmin && (
                <select
                  value={ticket.assigned_to || ''}
                  onChange={(e) => handleAssignAgent(Number(e.target.value))}
                  className="assign-select"
                >
                  <option value="">Assign to Agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="ticket-body">
            <p className="ticket-description">{ticket.description}</p>
            <div className="ticket-meta">
              <span>
                Created: {new Date(ticket.created_at).toLocaleString()}
              </span>
              <span>
                Updated: {new Date(ticket.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <strong>{comment.author_name || 'Unknown'}</strong>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={4}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;