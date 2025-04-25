import { Comment } from './types';
import axios from 'axios';
import { useState } from 'react';
interface Props {
  comment: Comment;
  onUpdate?: () => void;
}

const CommentItem = ({ comment, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  
  const handleDelete = async () => {
    if (confirm('댓글을 삭제할까요?')) {
      await axios.delete(`/api/comments/${comment.id}`);
      onUpdate ? onUpdate() : window.location.reload();
    }
  };

  const handleEdit = async () => {
    await axios.put(`/api/comments/${comment.id}`, {
      content: editedContent,
    });
    setIsEditing(false);
    onUpdate ? onUpdate() : window.location.reload();
  };

  const handleReplySubmit = async () => {
    await axios.post(`/api/comments/reply/${comment.id}`, {
      content: replyContent,
    });
    setReplyContent('');
    setShowReplyForm(false);
    onUpdate ? onUpdate() : window.location.reload();
  };

  return (
    <div className="border-b py-2">
      <div className="font-semibold">{comment.writer}</div>

      {isEditing ? (
        <>
          <textarea
            className="w-full p-2 border rounded my-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="space-x-2 text-sm">
            <button onClick={handleEdit} className="text-blue-500">저장</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500">취소</button>
          </div>
        </>
      ) : (
        <>
          <div>{comment.content}</div>
          <div className="text-sm text-gray-500">{comment.createdAt}</div>
          <div className="space-x-3 text-sm mt-1">
            <button onClick={() => setIsEditing(true)} className="text-blue-500">수정</button>
            <button onClick={handleDelete} className="text-red-500">삭제</button>
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-green-500">답글</button>
          </div>
        </>
      )}

      {showReplyForm && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded mb-1"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
          />
          <div className="space-x-2 text-sm">
            <button onClick={handleReplySubmit} className="text-green-500">등록</button>
            <button onClick={() => setShowReplyForm(false)} className="text-gray-500">취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;

