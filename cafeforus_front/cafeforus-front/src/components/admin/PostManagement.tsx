import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";

interface Post {
  id: number;
  title: string;
  author: string;
  view: number;
  commentCount: number;
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/all/post", { withCredentials: true });
      setPosts(res.data);
    } catch (err) {
      setError("글 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (postId: number) => {
    setPostToDelete(postId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (postToDelete == null) return;
    try {
      setLoading(true);
      await axios.delete(`/api/admin/post/delete/${postToDelete}`, { withCredentials: true });
      await fetchPosts();
    } catch (err) {
      setError("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setPostToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">글 관리</h2>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">제목</th>
              <th className="p-3">작성자</th>
              <th className="p-3">조회수</th>
              <th className="p-3">댓글 수</th>
              <th className="p-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.author}</td>
                <td className="p-3">{post.view}</td>
                <td className="p-3">{post.commentCount}</td>
                <td className="p-3 text-right">
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">삭제 확인</h3>
            <p>이 글을 삭제하시겠습니까?</p>
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

