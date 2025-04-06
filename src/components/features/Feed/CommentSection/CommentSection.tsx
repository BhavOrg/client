// CommentSection.tsx
import React, { useState, useEffect } from "react";
import {
  FaComments,
  FaSpinner,
  FaExclamationTriangle,
  FaLock,
} from "react-icons/fa";
import Comment from "../Comment/Comment";
import CommentForm from "../CommentForm/CommentForm";
import {
  fetchComments,
  createComment,
  likeComment,
} from "../../../../services/commentsService";
import useAuth from "../../../../hooks/useAuth";
import styles from "./CommentSection.module.scss";

interface CommentSectionProps {
  postId: string;
}

// API response interface
interface ApiResponse {
  status: string;
  data?: {
    comments?: any[];
    pagination?: any;
  };
  message?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    const loadComments = async () => {
      if (!isAuthenticated) {
        setAuthError(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setAuthError(false);
        const response = await fetchComments(postId);

        // Extract comments from the nested response
        let commentsArray: any[] = [];

        if (response && typeof response === "object") {
          if (
            response.status === "success" &&
            response.data &&
            response.data.comments
          ) {
            commentsArray = response.data.comments;
          } else if (Array.isArray(response)) {
            commentsArray = response;
          }
        }

        setComments(commentsArray);
        setError(null);
      } catch (err) {
        setError("Failed to load comments. Please try again.");
        console.error("Error fetching comments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId, isAuthenticated, refreshKey]);

  // Refresh comments
  const refreshComments = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Handle new comment submission
  // Inside your CommentSection component

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    try {
      const response = await createComment(postId, content, parentId);

      // Extract the new comment data from the response
      let newComment;
      if (response && typeof response === "object") {
        // Check if the response has a data property (API format 1)
        if ("data" in response) {
          newComment = response.data;
        }
        // Check if the response has a comment property (API format 2)
        else if ("comment" in response) {
          newComment = response.comment;
        }
        // Assume the response is the comment itself (API format 3)
        else {
          newComment = response;
        }
      }

      console.log("New comment created:", newComment);

      if (!newComment) {
        throw new Error("Invalid comment data received");
      }

      // If this is a reply to an existing comment
      if (parentId) {
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            const commentId = comment.comment_id || comment.id;
            if (commentId === parentId) {
              // Initialize replies array if it doesn't exist
              const replies = comment.replies || [];
              return {
                ...comment,
                replies: [...replies, newComment],
              };
            }
            return comment;
          });
        });
      } else {
        // This is a new top-level comment - add it to the comments array
        setComments((prevComments) => [...prevComments, newComment]);
      }

      return true;
    } catch (err) {
      console.error("Error creating comment:", err);
      return false;
    }
  };

  // Handle like/unlike comment
  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    try {
      // Update optimistically
      setComments((prevComments) =>
        prevComments.map((comment) => {
          const currCommentId = comment.comment_id || comment.id;
          if (currCommentId === commentId) {
            return {
              ...comment,
              upvotes: isLiked
                ? (comment.upvotes || 0) + 1
                : (comment.upvotes || 0) - 1,
              user_vote: isLiked ? "up" : null,
            };
          }
          // Check in replies too
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply: any) => {
                const replyId = reply.comment_id || reply.id;
                if (replyId === commentId) {
                  return {
                    ...reply,
                    upvotes: isLiked
                      ? (reply.upvotes || 0) + 1
                      : (reply.upvotes || 0) - 1,
                    user_vote: isLiked ? "up" : null,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        }),
      );

      // Call the API
      await likeComment(commentId, isLiked);
    } catch (err) {
      console.error("Error liking comment:", err);
      // Reload comments on error to ensure data consistency
      refreshComments();
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>
        <FaComments style={{ color: "#6E57B5", marginRight: "8px" }} />
        Comments ({comments.length})
      </h3>

      {/* Authentication error */}
      {authError ? (
        <div className={styles.authError}>
          <FaLock style={{ marginRight: "8px" }} />
          <p>Please log in to view and post comments.</p>
        </div>
      ) : (
        <>
          {/* New comment form - only show if authenticated */}
          {isAuthenticated && (
            <div className={styles.newCommentForm}>
              <CommentForm
                onSubmit={(content: string) => handleCommentSubmit(content)}
                placeholder="Share your thoughts..."
              />
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className={styles.loading}>
              <FaSpinner className={styles.spinner} />
              Loading comments...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.error}>
              <FaExclamationTriangle style={{ marginRight: "8px" }} />
              {error}
              <button onClick={refreshComments} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          )}

          {/* Comments list */}
          {!isLoading && !error && (
            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <div className={styles.noComments}>
                  No comments yet.{" "}
                  {isAuthenticated
                    ? "Be the first to share your thoughts!"
                    : ""}
                </div>
              ) : (
                comments.map((comment) => (
                  <Comment
                    key={
                      comment.comment_id ||
                      comment.id ||
                      Math.random().toString()
                    }
                    comment={comment}
                    onReply={(content: string) =>
                      handleCommentSubmit(
                        content,
                        comment.comment_id || comment.id,
                      )
                    }
                    onLike={(isLiked: boolean) =>
                      handleCommentLike(
                        comment.comment_id || comment.id,
                        isLiked,
                      )
                    }
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
