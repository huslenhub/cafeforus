// App.tsx
import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import useAuth from './context/useAuth';
import AdminDashboard from './pages/AdminDashboard';
import CategoryPostsPage from './pages/CategoryPostsPage';
import WritePostPage from './pages/WritePostPage'; // ✅ 글쓰기 페이지 import
import PostDetailPage from './pages/PostDetailPage';
import SearchPage from './pages/SearchPage';



const App = () => {
  const { user } = useAuth();
  console.log("User: ", user);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/category/:categoryId" element={<CategoryPostsPage />} />  {/* 카테고리 ID에 따라 글 목록을 표시 */}
        <Route path="/write/:categoryId" element={<WritePostPage />} /> {/* ✅ 글쓰기 경로 추가 */}
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
};

export default App;