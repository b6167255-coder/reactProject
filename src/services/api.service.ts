import axios from "axios";

const API_URL = "http://localhost:4000";

interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "agent" | "admin";
  is_active: boolean;
  created_at: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

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

interface CreateTicketData {
  subject: string;
  description: string;
  priority_id: number;
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

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const getMe = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTickets = async (token: string): Promise<Ticket[]> => {
  const response = await axios.get(`${API_URL}/tickets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTicket = async (
  token: string,
  ticketId: number
): Promise<Ticket> => {
  const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createTicket = async (
  token: string,
  data: CreateTicketData
): Promise<Ticket> => {
  const response = await axios.post(`${API_URL}/tickets`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTicket = async (
  token: string,
  ticketId: number,
  data: Partial<Ticket>
): Promise<Ticket> => {
  const response = await axios.patch(`${API_URL}/tickets/${ticketId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTicket = async (
  token: string,
  ticketId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/tickets/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPriorities = async (token: string) => {
  const response = await axios.get(`${API_URL}/priorities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStatuses = async (token: string) => {
  const response = await axios.get(`${API_URL}/statuses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getComments = async (
  token: string,
  ticketId: number
): Promise<Comment[]> => {
  const response = await axios.get(`${API_URL}/tickets/${ticketId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createComment = async (
  token: string,
  ticketId: number,
  content: string
): Promise<Comment> => {
  const response = await axios.post(
    `${API_URL}/tickets/${ticketId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getUsers = async (token: string): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'agent' | 'admin';
}

export const createUser = async (
  token: string,
  data: CreateUserData
): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};