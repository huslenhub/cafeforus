
// pages/signup.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ 로그인된 사용자는 회원가입 페이지 진입 차단
  useEffect(() => {
    if (isAuthenticated) {
      alert('이미 로그인된 상태입니다.');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // ✅ 회원가입 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 기본 유효성 검사
    if (username.length < 3) {
      alert('아이디는 최소 3자 이상이어야 합니다.');
      return;
    }
    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (!email.includes('@')) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await register(username, password, email);
      alert('회원가입 성공! 환영합니다 🎉');
      navigate('/');
    } catch {
      alert('회원가입 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">회원가입</h2>

        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-3 rounded-md hover:bg-green-700 transition duration-200"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
