import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../context/useAuth';
import { Link } from 'react-router-dom'; // Link를 임포트하여 페이지 이동

interface Category {
  id: number;
  name: string;
}

const Home = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 목록을 가져오는 함수
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/category/all', { withCredentials: true });
      const sortedCategories = res.data.sort((a: Category, b: Category) => a.name.localeCompare(b.name)); // 카테고리 이름 알파벳 순으로 정렬
      setCategories(sortedCategories);
    } catch (err) {
      setError('카테고리 목록을 가져오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-indigo-600 mb-8">
        Welcome to CafeUs, {user}!
      </h1>

      {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div className="w-full max-w-xl space-y-4">
          <h2 className="text-xl font-bold text-gray-700">카테고리 목록</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center p-2 border rounded">
                <Link
                  to={`/category/${category.id}`}  // 카테고리 클릭 시 해당 카테고리의 글 목록 페이지로 이동
                  className="text-blue-500 hover:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
