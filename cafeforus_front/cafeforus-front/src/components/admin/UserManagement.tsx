import React, { useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  level: "BASIC" | "SILVER" | "GOLD" | "VIP" | "ADMIN";
  role: string;
  postCount: number;
  commentCount: number;
}

const users: User[] = [
  { id: 1, username: "user01", email: "user01@gmail.com", level: "BASIC", role: "USER", postCount: 5, commentCount: 12 },
  { id: 2, username: "user02", email: "user02@gmail.com", level: "SILVER", role: "USER", postCount: 10, commentCount: 18 },
  { id: 3, username: "user03", email: "user03@gmail.com", level: "SILVER", role: "USER", postCount: 8, commentCount: 20 },
  { id: 4, username: "user04", email: "user04@gmail.com", level: "GOLD", role: "USER", postCount: 15, commentCount: 30 },
  { id: 5, username: "admin01", email: "admin01@gmail.com", level: "ADMIN", role: "ADMIN", postCount: 40, commentCount: 80 },
  { id: 6, username: "user05", email: "user05@gmail.com", level: "BASIC", role: "USER", postCount: 3, commentCount: 5 },
  { id: 7, username: "user06", email: "user06@gmail.com", level: "GOLD", role: "USER", postCount: 20, commentCount: 45 },
  { id: 8, username: "user07", email: "user07@gmail.com", level: "VIP", role: "USER", postCount: 25, commentCount: 60 },
];

const levels: ("ALL" | User["level"])[] = ["ALL", "BASIC", "SILVER", "GOLD", "VIP", "ADMIN"];

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | User["level"]>("ALL");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "ALL" || user.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">유저 관리</h2>

      {/* 필터 + 검색 */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* 레벨 필터 */}
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedLevel === level ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by username or email"
            className="border rounded px-3 py-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setSearch(search)}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </div>

      {/* 유저 테이블 */}
      <div className="overflow-x-auto border bg-white rounded">
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.level}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.postCount}</td>
                <td className="p-3">{user.commentCount}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
