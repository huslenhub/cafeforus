import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../context/useAuth'; // 경로에 맞게 수정하세요
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';


interface Post {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
  author: {
    username: string;
  };
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  views: number; // ✅ 요거 추가!
}

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    if (!postId) return;

    axios.get(`/api/posts/read/${postId}`, { withCredentials: true })
      .then(res => {
        console.log('📦 게시글 데이터:', res.data); // ✅ 콘솔 출력 추가
        setPost(res.data);
      })
      .catch(err => {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러올 수 없습니다.');
        navigate('/');
      });
  }, [postId]);

  const handleDelete = async () => {
    if (!postId) return;
    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/api/posts/delete/${postId}`, { withCredentials: true });
      alert(res.data); // 백엔드에서 "게시글이 삭제되었습니다." 메시지 반환
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || '게시글 삭제에 실패했습니다.';
      alert(message);
    }
    
  };

  if (!post) return <div className="text-center mt-20">불러오는 중...</div>;

  const isAuthorOrAdmin = user === post.author.username || role === 'ADMIN';
  const imageUrl = post.imagePath ? `http://localhost:8080/uploads/${encodeURIComponent(post.imagePath)}` : '';

  if (!postId) return <div>잘못된 접근입니다.</div>; // postId가 undefined일 경우 처리

  const numericPostId = parseInt(postId, 10);

  return (
    <div className="max-w-3xl mx-auto p-8 mt-32 bg-white shadow-md rounded-lg">
      <div className="mb-4 flex justify-between items-center text-gray-500 text-sm">
        <div className="text-sm text-gray-500 mb-2">
          {post.category.name} | 작성자: {post.author.username} | {new Date(post.createdAt).toLocaleString()} | 조회수: {post.views}
        </div>
        <div className="flex gap-2">
          {user === post.author.username && (
            <button
              onClick={() => navigate(`/write/${post.category.id}`, { state: { post, isEdit: true } })}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정
            </button>
          )}
          {isAuthorOrAdmin && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="첨부 이미지" className="max-w-full rounded" />
        </div>
      )}
      <div className="text-lg whitespace-pre-wrap">{post.content}</div>

      <div>
        <CommentForm postId={numericPostId} onCommentAdded={ () => {}} />
        <CommentList postId={numericPostId} /> 
      </div>
    </div>
  );
};

export default PostDetailPage;
