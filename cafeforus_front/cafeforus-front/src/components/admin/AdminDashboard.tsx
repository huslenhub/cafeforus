import { useState } from "react";
import UserManagement from "./UserManagement";
import CategoryManagement from "./CategoryManagement";
import PostManagement from "./PostManagement";
import LevelUpRequests from "./LevelUpRequests";

type TabType = "user" | "category" | "post" | "levelup";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("user");

  return (
    <div className="p-6" >
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 rounded ${
            activeTab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          유저 관리
        </button>
        <button
          onClick={() => setActiveTab("category")}
          className={`px-4 py-2 rounded ${
            activeTab === "category" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          카테고리 관리
        </button>
        <button
          onClick={() => setActiveTab("post")}
          className={`px-4 py-2 rounded ${
            activeTab === "post" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          글 관리
        </button>
        <button
          onClick={() => setActiveTab("levelup")}
          className={`px-4 py-2 rounded ${
            activeTab === "levelup" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          등업 요청
        </button>
      </div>

      <div>
        {activeTab === "user" && <UserManagement />}
        {activeTab === "category" && <CategoryManagement />}
        {activeTab === "post" && <PostManagement />}
        {activeTab === "levelup" && <LevelUpRequests />}
      </div>
    </div>
  );
};

export default AdminDashboard;
