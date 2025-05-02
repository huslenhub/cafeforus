// pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🔐 로그인된 사용자는 로그인 페이지 접근 차단
  useEffect(() => {
    if (isAuthenticated) {
      alert('이미 로그인된 상태입니다.');
      navigate('/'); // 홈 또는 마이페이지 등으로 이동
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // login 함수 호출 시, 객체 형태로 전달
      await login({ username, password });
      navigate('/'); // 로그인 후 홈으로 이동
    } catch (error: any) {
      setError(error.message || '로그인 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">로그인</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>} {/* 에러 메시지 표시 */}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-3 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
