// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // import 추가
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { useAuth } from './context/useAuth';
import CategoryPostsPage from './pages/CategoryPostsPage';
import WritePostPage from './pages/WritePostPage';
import PostDetailPage from './pages/PostDetailPage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ChatLayout from './components/chat/ChatLayout';
import AccessDenied from './components/AccessDenied';

// QueryClient 생성
const queryClient = new QueryClient();

const App = () => {
  const { user, level, isAuthenticated, isLoading, isError, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;  // 로딩 중 표시
  }

  if (isError) {
    return <div>Error loading user information</div>;  // 오류 표시
  }

  return (
    // QueryClientProvider로 앱을 감쌈
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={level === 'ADMIN' ? <AdminDashboard /> : <AccessDenied requiredRole="ADMIN" />}
        />

        <Route path="/category/:categoryId" element={<CategoryPostsPage />} />
        <Route path="/write/:categoryId" element={<WritePostPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatLayout />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
