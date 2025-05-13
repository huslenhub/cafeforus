import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // ✅ 이 줄 추가
  },
  server: {
    port: 3000,
    proxy : {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});