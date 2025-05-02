import React from 'react';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/useAuth';

interface Post {
  id: number;
  title: string;
  content: string;
}

const CategoryPostsPage = () => {
  const { level } = useAuth();
  const { categoryId } = useParams<{ categoryId: string }>(); // URL에서 categoryId를 가져옵니다.
  const [categoryName, setCategoryName] = useState<string>(''); // 카테고리 이름 상태 추가
  const [minReadLevel, setMinReadLevel] = useState<string[]>([]); // 작성 가능한 역할 저장
  const [minWriteLevel, setMinWriteLevel] = useState<string[]>([]); // 작성 가능한 역할 저장
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate 사용


  // 카테고리의 이름을 가져오는 함수
  const fetchCategoryName = useCallback(async () => {
    try {
      const res = await axios.get(`/api/category/name/${categoryId}`, { withCredentials: true });
      setCategoryName(res.data.name); // 카테고리 이름 설정
      setMinReadLevel(res.data.minReadLevel);
      setMinWriteLevel(res.data.minWriteLevel);
      console.log("카테고리 이름 : ",  res.data.name);
      console.log("작성 가능 역할:",  res.data.minWriteLevel);
      console.log("조회 가능 레벨: ",  res.data.minReadLevel)
      console.log(res.data);
    } catch (err) {
      setError('카테고리 이름을 가져오는 데 실패했습니다.');
      console.error(err);
    }
  }, [categoryId]);


  // 카테고리의 글 목록을 가져오는 함수
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/posts/category/${categoryId}`, { withCredentials: true });
      setPosts(res.data);
    } catch (err) {
      setError('글 목록을 가져오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryName(); // 카테고리 이름을 가져옵니다.
      fetchPosts(); // 카테고리 글 목록을 가져옵니다.
    }
  }, [categoryId, fetchCategoryName, fetchPosts]);

  // 글쓰기 버튼 클릭 시 이동
  const handleWriteClick = () => {
    navigate(`/write/${categoryId}`);
  };

  const canWrite =  level !== null && minWriteLevel.includes(level);
  const canRead = level !== null && minReadLevel.includes(level);

  return (
    <div className="p-8 max-w-xl mx-auto mt-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">카테고리: {categoryName}의 글 목록</h1>
        {canWrite && (
          <button
            onClick={handleWriteClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            글쓰기
          </button>
        )}  
      </div>

      {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <h2 className="text-xl font-semibold text-blue-600">{post.title}</h2>
              <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPostsPage;