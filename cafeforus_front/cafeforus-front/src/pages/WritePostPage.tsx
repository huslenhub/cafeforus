import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
  category: {
    id: number;
    name: string;
  };
}

const WritePostPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { post?: Post; isEdit?: boolean };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categoryId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get('/api/category/all', { withCredentials: true })
      .then(res => {
        setCategories(res.data);
        if (!selectedCategoryId && res.data.length > 0) {
          setSelectedCategoryId(res.data[0].id.toString());
        }
      })
      .catch(err => console.error("카테고리 목록 가져오기 실패", err));
  }, []);

  useEffect(() => {
    if (state?.isEdit && state.post) {
      setTitle(state.post.title);
      setContent(state.post.content);
      setSelectedCategoryId(state.post.category.id.toString());
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    const postDtoBlob = new Blob([JSON.stringify({
      title,
      content,
      categoryId: selectedCategoryId,
    })], { type: 'application/json' });

    formData.append('postDto', postDtoBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (state?.isEdit && state.post) {
        await axios.put(`/api/posts/update/${state.post.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        alert('글 수정 완료!');
        navigate(`/posts/${state.post.id}`);
      } else {
        await axios.post('/api/posts/write', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        alert('글 작성 완료!');
        navigate(`/category/${selectedCategoryId}`);
      }
    } catch (err) {
      console.error(err);
      alert(state?.isEdit ? '글 수정 실패' : '글 작성 실패');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">{state?.isEdit ? '글 수정' : '글쓰기'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">카테고리 선택</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-40"
            minLength={10}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">이미지 첨부 (선택)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImageFile(e.target.files[0]);
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {state?.isEdit ? '글 수정' : '글 작성'}
        </button>
      </form>
    </div>
  );
};

export default WritePostPage;
