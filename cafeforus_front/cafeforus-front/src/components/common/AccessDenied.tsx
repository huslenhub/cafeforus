// components/AccessDenied.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface Props {
  requiredRole: string;
}

const AccessDenied: React.FC<Props> = ({ requiredRole }) => {
  const { level } = useAuth();
  const userLevel = level ?? "비로그인";

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">접근 권한이 없습니다</h1>
        
        <p className="mt-4">
          현재 사용자 권한: <strong>{userLevel}</strong>
        </p>
        <p className="mt-2">
          이 페이지에 접근하려면 <strong>{requiredRole}</strong> 권한이 필요합니다.
        </p>
        
        <Link to="/" className="text-blue-500 mt-4 inline-block">홈으로 돌아가기</Link>
      </div>
    </div>

  );
};

export default AccessDenied;
