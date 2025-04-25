import { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment, CommentsResponse } from './types';
import CommentItem from './CommentItem';

interface Props {
  postId: number;
}

const CommentList = ({ postId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchComments = async () => {
    const res = await axios.get<CommentsResponse>(`/api/posts/comments/${postId}?page=${currentPage}`);
    setComments(res.data.comments);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchComments();
  }, [postId, currentPage]);

  return (
    <div>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
