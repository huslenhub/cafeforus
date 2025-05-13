import { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment, CommentsResponse } from '../../types/types';
import CommentItem from './CommentItem';

interface Props {
  postId: number;
  refreshTrigger: number;
}

const CommentList = ({ postId, refreshTrigger }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const res = await axios.get<CommentsResponse>(`/api/posts/comments/${postId}`);
    setComments(res.data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [postId, refreshTrigger]);

  return (
    <div className="mt-4">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} onUpdate={fetchComments} />
      ))}
    </div>
  );
};

export default CommentList;
