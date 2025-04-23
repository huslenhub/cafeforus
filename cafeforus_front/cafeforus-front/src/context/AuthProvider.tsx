// AuthProvider.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, checkLogin } from './authUtils';

interface AuthContextType {
  user: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// children을 명시적으로 타입을 지정해 줍니다.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const result = await checkLogin();
      if (result) {
        setUser(result.username);
        setRole(result.role); 
        localStorage.setItem('user', result.username);
        localStorage.setItem('role', result.role);
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('user');
      }
    };

    initializeUser();
  }, []);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const { username: loggedInUsername, role: userRole } = await loginUser(username, password);
      setUser(loggedInUsername);
      setRole(userRole); 

      alert(`Welcome ${loggedInUsername}! 로그인 성공! \n권한: ${userRole}`);
      navigate('/');
      return loggedInUsername;
    } catch (error) {
      alert('로그인 실패!');
      throw error;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const register = async (username: string, password: string, email: string) => {
    return registerUser(username, password, email);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
