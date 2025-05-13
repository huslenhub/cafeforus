// pages/SearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
  category: {
    name: string;
  };
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<Post[]>([]);
  const [filter, setFilter] = useState('content'); // default: 글 내용
  const navigate = useNavigate(); // useNavigate 사용

  // 검색 요청
  useEffect(() => {
    if (!query) return;
    axios.get(`/api/posts/search?query=${encodeURIComponent(query)}&filter=${filter}`)
      .then(res => setResults(res.data))
      .catch(err => {
        console.error('검색 실패:', err);
        alert('검색 중 문제가 발생했습니다.');
      });
  }, [query, filter]); // 필터가 변경될 때마다 새로 요청

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔍 "{query}" 검색 결과</h2>

      {/* 검색 필터 선택 */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="content">글 내용</option>
          <option value="title">글 제목</option>
          <option value="author">작성자</option>
        </select>
      </div>

      {results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {results.map(post => (
            <li
            key={post.id}
            className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">
                {post.category.name} | 작성자: {post.author.username} | {new Date(post.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-800 line-clamp-2">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
