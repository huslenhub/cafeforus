
import { createContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, checkLogin } from './authUtils'; 

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  // 로그인 상태를 확인하기 위한 useEffect 추가
  useEffect(() => {
    const initializeUser = async () => {
      const username = await checkLogin();
      if (username) {
        setUser(username);
        localStorage.setItem('user', username);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    };
  
    initializeUser();
  }, []);

  // login 함수 수정
  const login = async (username: string, password: string): Promise<string> => {
    try {
      const loggedInUsername = await loginUser(username, password);
      setUser(loggedInUsername); 
      alert(`Welcome ${loggedInUsername}! 로그인 성공!`);
      navigate('/'); // 홈으로
      return loggedInUsername;  // username을 반환
    } catch (error) {
      alert('로그인 실패!');
      throw error;  // 오류를 다시 던져서 호출자에게 알림
    }
  };


  // logout
  const logout = async () => {
    await logoutUser();  
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // register
  const register = async (username: string, password: string, email: string) => {
    return registerUser(username, password, email);  
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;