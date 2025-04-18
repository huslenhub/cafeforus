//authUtils.ts
// 로그인 함수
export const loginUser = async (username: string, password: string): Promise<string> => {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        localStorage.setItem('user', username);
        return username;
    } else {
        throw new Error('로그인 실패');
    }
};
  // 로그아웃 함수
export const logoutUser = async (): Promise<void> => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
    });
    localStorage.removeItem('user');
};

  // 회원가입 함수
export const registerUser = async (username: string, password: string, email: string): Promise<void> => {
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, email }),
    });

    if (!res.ok) {
        throw new Error('회원가입 실패');
    }
};

// 로그인 상태 확인 함수
export const checkLogin = async (): Promise<string | null> => {
    try {
        const res = await fetch('/api/me', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            return data.username; // 또는 서버에서 넘겨주는 필드명에 따라 조정
        } else {
            return null;
        }
    } catch (error) {
        console.error('로그인 확인 실패:', error);
        return null;
    }
};

