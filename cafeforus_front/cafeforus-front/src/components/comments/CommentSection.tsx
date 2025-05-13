import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Props {
  postId: number;
}

const CommentsSection = ({ postId }: Props) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">댓글</h2>
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      <CommentList postId={postId} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default CommentsSection;
