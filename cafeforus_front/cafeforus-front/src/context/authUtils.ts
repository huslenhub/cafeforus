
//authUtils,ts

import { AuthUser } from '../types/types';

const handleResponse = async (res: Response) => {
    const data = await res.json();
    console.log('서버 응답:', data);
    if (!res.ok) throw new Error(data.error || '요청 실패');
    return data;
  };
  
  export const loginUser = async (username: string, password: string): Promise<AuthUser> => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    return await handleResponse(res);
  };

  export const logoutUser = async (): Promise<void> => {
    const res = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    const text = await res.text();
    console.log('로그아웃 응답:', text);
  };
  
  export const registerUser = async (username: string, password: string, email: string): Promise<void> => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password, email }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || '회원가입 실패');
    }
  };
  
  export const checkLogin = async (): Promise<AuthUser | null> => {
  const res = await fetch('/api/me', {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error(await res.text() || 'Unknown error');
  return await res.json();
};
  