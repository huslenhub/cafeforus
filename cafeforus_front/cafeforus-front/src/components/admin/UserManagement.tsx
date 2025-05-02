import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

// 사용자 인터페이스 정의
interface User {
  id: number;
  username: string;
  email: string;
  level: string;
  role: string;
  postCount: number;
  commentCount: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // ✅ 백엔드 GET 요청: 모든 카테고리 목록 조회
      const res = await axios.get("/api/admin/all/user", { withCredentials: true });
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      setError("유저 볼러오는데 실패 했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">유저 리스트</h2>
      </div>

      {loading && <div className="text-blue-500">로딩 중...</div>}

      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Level</th>
              <th className="p-3">Role</th>
              <th className="p-3">Post Count</th>
              <th className="p-3">Comment Count</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.level}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.postCount}</td>
                  <td className="p-3">{user.commentCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-3">유저 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
