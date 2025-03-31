import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Comment from "../Comment/Comment";
import CommentForm from "../CommentForm/CommentForm";
import {
  fetchComments,
  createComment,
} from "../../../../services/commentsService";
import { Comment as CommentType } from "../../../../types/feed";
import styles from "./CommentSection.module.scss";

interface CommentSectionProps {
  postId: string;
  hasExpertResponse?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  hasExpertResponse,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const response = await fetchComments(postId);
        setComments(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to load comments. Please try again.");
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleCreateComment = async (content: string, parentId?: string) => {
    try {
      const newComment = await createComment(postId, content, parentId);

      if (!parentId) {
        // Add new top-level comment
        setComments([newComment, ...comments]);
      } else {
        // Add reply to existing comment
        setComments(
          comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          }),
        );
      }

      // Reset reply state
      setIsReplying(false);
      setReplyingToId(null);
    } catch (err) {
      setError("Failed to post comment. Please try again.");
    }
  };

  const handleReplyClick = (commentId: string) => {
    setIsReplying(true);
    setReplyingToId(commentId);
  };

  const cancelReply = () => {
    setIsReplying(false);
    setReplyingToId(null);
  };

  // Organize comments into a thread structure (top-level comments and their replies)
  const topLevelComments = comments.filter((comment) => !comment.parentId);

  // Sort to ensure expert responses appear at the top
  const sortedComments = [...topLevelComments].sort((a, b) => {
    // Sort expert responses first
    if (a.isExpertResponse && !b.isExpertResponse) return -1;
    if (!a.isExpertResponse && b.isExpertResponse) return 1;

    // Then sort by recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={styles.commentSection}>
      <div className={styles.commentHeader}>
        <h3 className={styles.commentTitle}>Comments ({comments.length})</h3>
        {hasExpertResponse && (
          <div className={styles.expertResponseBadge}>
            Includes Expert Response
          </div>
        )}
      </div>

      <div className={styles.newCommentForm}>
        <CommentForm onSubmit={(content) => handleCreateComment(content)} />
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading comments...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : sortedComments.length === 0 ? (
        <div className={styles.noComments}>
          <p>No comments yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className={styles.commentsContainer}>
          {sortedComments.map((comment) => (
            <div key={comment.id} className={styles.commentThread}>
              <Comment
                comment={comment}
                onReplyClick={() => handleReplyClick(comment.id)}
              />

              {/* Show reply form if this comment is being replied to */}
              {isReplying && replyingToId === comment.id && (
                <div className={styles.replyForm}>
                  <CommentForm
                    onSubmit={(content) =>
                      handleCreateComment(content, comment.id)
                    }
                    onCancel={cancelReply}
                    isReply
                  />
                </div>
              )}

              {/* Show replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      onReplyClick={() => handleReplyClick(reply.id)}
                      isReply
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
