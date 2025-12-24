import {
  useEffect,
  useReducer,
  type FunctionComponent,
  type ReactNode,
} from 'react';
import { AuthContext } from './AuthContext';
import { getMe, loginUser } from '../services/api.service';

interface AuthProviderProps {
  children: ReactNode;
}

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

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: State = {
  user: null,
  token: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
};

const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setToken = (token: string | null) => {
    dispatch({ type: 'SET_TOKEN', payload: token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await getMe(token);
        setUser(data);
        setToken(token);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        logout();
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, setUser, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;