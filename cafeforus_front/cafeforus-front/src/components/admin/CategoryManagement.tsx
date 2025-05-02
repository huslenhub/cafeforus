import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Trash } from "lucide-react";

interface Category {
  id: number;
  name: string;
  postCount?: number; //없을 때 무시 할 수 있게
  minReadLevel: string;
  minWriteLevel: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [minRLevel, setMinRLevel] = useState("BASIC");
  const [minWLevel, setMinWLevel] = useState("BASIC");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // ✅ 백엔드 GET 요청: 모든 카테고리 목록 조회
      const res = await axios.get("/api/category/all", { withCredentials: true });
      console.log(res.data);
      setCategories(res.data);
    } catch (err) {
      setError("카테고리 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditCategory(category);
      setCategoryName(category.name);
      setMinRLevel(category.minReadLevel);
      setMinWLevel(category.minWriteLevel);
    } else {
      setEditCategory(null);
      setCategoryName("");
      setMinRLevel("BASIC");
      setMinWLevel("BASIC");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setCategoryName("");
    setMinRLevel("BASIC");
    setMinWLevel("BASIC");
    setError(null);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;

    try {
      setLoading(true);
      if (editCategory) {
        // ✅ 백엔드 PUT 요청: 카테고리 수정
        await axios.put(
          `/api/admin/category/update/${editCategory.id}`,
          {
            name: categoryName,
            minRLevel,
            minWLevel,
          },
          { withCredentials: true }
        );
      } else {
      // ✅ 백엔드 POST 요청: 카테고리 추가
        await axios.post(
          "/api/admin/category/add",
          {
            name: categoryName,
            minRLevel,
            minWLevel,
          },
          { withCredentials: true }
        );
      }
      await fetchCategories();
      closeModal();
    } catch (err) {
      setError("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete == null) return;
    try {
      setLoading(true);
            // ✅ 백엔드 DELETE 요청: 카테고리 삭제
      await axios.delete(`/api/admin/category/delete/${categoryToDelete}`, { withCredentials: true });
      await fetchCategories();
    } catch (err) {
      setError("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setCategoryToDelete(null);
    }
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

      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">이름</th>
              <th className="p-3">읽기 권한</th>
              <th className="p-3">쓰기 권한</th>
              <th className="p-3">게시글 수</th> 
              <th className="p-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.minReadLevel}</td>
                <td className="p-3">{cat.minWriteLevel}</td>
                <td className="p-3">{cat.postCount ?? 0}</td> 
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
              disabled={loading}
            />
            <div>
              <label className="block text-sm">읽기 권한</label>
              <select
                value={minRLevel}
                onChange={(e) => setMinRLevel(e.target.value)}
                className="w-full mt-2 border p-2 rounded"
                disabled={loading}
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
                value={minWLevel}
                onChange={(e) => setMinWLevel(e.target.value)}
                className="w-full mt-2 border p-2 rounded"
                disabled={loading}
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
                disabled={loading}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
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
                disabled={loading}
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
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
