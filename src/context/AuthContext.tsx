import { createContext, useContext } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface State {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  state: State;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  state: { user: null, token: null },
  setUser: () => {},
  setToken: () => {},
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};