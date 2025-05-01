import React from "react";

interface LevelUpRequest {
  id: number;
  username: string;
  email: string;
  reason: string;
  date: string;
  currentLevel: string;
  requestedLevel: string;
  requiredConditions: string;
  postCount: number;
  commentCount: number;
  status: "Pending" | "Approved" | "Rejected";
}

const requests: LevelUpRequest[] = [
  {
    id: 1,
    username: "user01",
    email: "user01@gmail.com",
    reason: "활동 열심히 함",
    date: "2025-04-29",
    currentLevel: "BASIC",
    requestedLevel: "SILVER",
    requiredConditions: "게시글 10개 이상, 댓글 20개 이상",
    postCount: 12,
    commentCount: 25,
    status: "Pending",
  },
];

export default function LevelUpRequestManagement() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">등업 요청 관리</h2>
      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">사용자</th>
              <th className="p-3">현재 레벨</th>
              <th className="p-3">요청 레벨</th>
              <th className="p-3">이메일</th>
              <th className="p-3">요청 사유</th>
              <th className="p-3">요청일</th>
              <th className="p-3">요구 조건</th>
              <th className="p-3">글 수</th>
              <th className="p-3">댓글 수</th>
              <th className="p-3">상태</th>
              <th className="p-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{req.username}</td>
                <td className="p-3">{req.currentLevel}</td>
                <td className="p-3">{req.requestedLevel}</td>
                <td className="p-3">{req.email}</td>
                <td className="p-3">{req.reason}</td>
                <td className="p-3">{req.date}</td>
                <td className="p-3">{req.requiredConditions}</td>
                <td className="p-3">{req.postCount}</td>
                <td className="p-3">{req.commentCount}</td>
                <td className="p-3">{req.status}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">승인</button>
                  <button className="text-red-600 hover:underline">거절</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
