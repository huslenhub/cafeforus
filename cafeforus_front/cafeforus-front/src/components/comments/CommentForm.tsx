import { useState } from 'react';
import axios from 'axios';

interface Props {
  postId: number;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: Props) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/comments/', { postId, content });
    setContent('');
    onCommentAdded();  // 부모에게 알림
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="댓글을 입력하세요"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        댓글 작성
      </button>
    </form>
  );
};

export default CommentForm;
