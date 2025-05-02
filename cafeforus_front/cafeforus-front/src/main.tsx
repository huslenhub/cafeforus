// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // QueryClient와 QueryClientProvider 추가
import './styles/tailwind.css';

const queryClient = new QueryClient(); // QueryClient 인스턴스 생성

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>  {/* QueryClientProvider로 App을 감쌈 */}
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
