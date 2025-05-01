import React, { useState } from "react";
import { Pencil, Plus, Trash } from "lucide-react";

interface Category {
  id: number;
  name: string;
  postCount: number;
  readPermission: string;
  writePermission: string;
}

const initialCategories: Category[] = [
  { id: 1, name: "공지사항", postCount: 5, readPermission: "BASIC", writePermission: "BASIC" },
  { id: 2, name: "자유게시판", postCount: 20, readPermission: "SILVER", writePermission: "SILVER" },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [readPermission, setReadPermission] = useState("BASIC");
  const [writePermission, setWritePermission] = useState("BASIC");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const openModal = (category?: Category) => {
    if (category) {
      setEditCategory(category);
      setCategoryName(category.name);
      setReadPermission(category.readPermission);
      setWritePermission(category.writePermission);
    } else {
      setEditCategory(null);
      setCategoryName("");
      setReadPermission("BASIC");
      setWritePermission("BASIC");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setCategoryName("");
    setReadPermission("BASIC");
    setWritePermission("BASIC");
  };

  const handleSave = () => {
    if (editCategory) {
      // 수정
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategory.id
            ? { ...cat, name: categoryName, readPermission, writePermission }
            : cat
        )
      );
    } else {
      // 추가
      const newCategory: Category = {
        id: Date.now(),
        name: categoryName,
        postCount: 0,
        readPermission,
        writePermission,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    closeModal();
  };

  const handleDelete = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter((cat) => cat.id !== categoryToDelete));
    setShowConfirmDelete(false);
    setCategoryToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">카테고리 관리</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </button>
      </div>

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">이름</th>
              <th className="p-3">게시글 수</th>
              <th className="p-3">읽기 권한</th>
              <th className="p-3">쓰기 권한</th>
              <th className="p-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.postCount}</td>
                <td className="p-3">{cat.readPermission}</td>
                <td className="p-3">{cat.writePermission}</td>
                <td className="p-3 text-right">
                  <button
                    className="text-gray-500 hover:text-blue-500 mr-2"
                    onClick={() => openModal(cat)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {editCategory ? "카테고리 수정" : "카테고리 추가"}
            </h3>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="카테고리 이름"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <div>
              <label className="block text-sm">읽기 권한</label>
              <select
                value={readPermission}
                onChange={(e) => setReadPermission(e.target.value)}
                className="w-full mt-2 border p-2 rounded"
              >
                <option value="BASIC">BASIC</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="VIP">VIP</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">쓰기 권한</label>
              <select
                value={writePermission}
                onChange={(e) => setWritePermission(e.target.value)}
                className="w-full mt-2 border p-2 rounded"
              >
                <option value="BASIC">BASIC</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="VIP">VIP</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">삭제 확인</h3>
            <p>이 카테고리를 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
