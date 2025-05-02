import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user, logout, level } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/'); // 로그아웃 후 홈으로 리디렉션
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-600 p-4 flex justify-between items-start z-50 shadow-md">
      {/* 홈 로고 */}
      <Link to="/" className="font-bold text-white text-2xl hover:underline">
        CafeForUs
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-4 items-center">
          {user && level === 'ADMIN' && (
            <Link
              to="/admin"
              className="text-red-300 font-semibold hover:underline"
            >
              관리자 대시보드
            </Link>
          )}

          {user ? (
            <>
              <span className="text-white">안녕하세요, {user.username}님 level : {level}</span>
              <button
                onClick={handleLogout}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline">
                로그인
              </Link>
              <Link to="/signup" className="text-white hover:underline">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 🔍 검색창 */}
        {user && (
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="게시글 검색"
              className="px-2 py-1 rounded border"
            />
            <button
              onClick={handleSearch}
              className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              검색
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
