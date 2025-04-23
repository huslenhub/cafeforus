// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  //<React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App /> {/* App은 AuthProvider의 children으로 전달됩니다 */}
      </AuthProvider>
    </BrowserRouter>
  //</React.StrictMode>
);
