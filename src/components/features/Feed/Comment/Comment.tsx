// Comment.tsx
import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  FaHeart,
  FaRegHeart,
  FaReply,
  FaEllipsisH,
  FaCheck,
  FaFlag,
  FaLink,
  FaShare,
  FaExclamationTriangle,
} from "react-icons/fa";
import CommentForm from "../CommentForm/CommentForm";
import Avatar from "../../../common/Avatar/Avatar";
import styles from "./Comment.module.scss";

interface CommentProps {
  comment: any; // Using flexible type to handle different API formats
  onReply: (content: string) => Promise<boolean>;
  onLike: (isLiked: boolean) => void;
  depth?: number; // Track nesting depth for styling
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onLike,
  depth = 0,
}) => {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle different API formats by normalizing the data
  const commentId = comment.comment_id || comment.id;
  const isAnonymous = comment.is_anonymous || comment.isAnonymous || true;
  const isExpertResponse =
    comment.is_expert_response || comment.isExpertResponse || false;
  const likeCount = comment.upvotes || comment.likeCount || 0;
  const isLiked = comment.user_vote === "up" || comment.isLikedByUser || false;

  // For author info, handle both formats
  let authorUsername = null;
  let avatarUrl = undefined;

  if (comment.author) {
    // Modern API format
    authorUsername = comment.author.username;
    avatarUrl = comment.author.avatarUrl;
  } else {
    // Legacy API format
    authorUsername = comment.author_username;
    // No avatar URL in legacy format
  }

  // Use "Anonymous" for display if no username or is anonymous
  const displayName =
    isAnonymous || !authorUsername ? "Anonymous" : authorUsername;

  // Format date with a fallback
  const createdAt = comment.created_at || comment.createdAt;
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Animation when comment is added
  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.classList.add(styles.fadeIn);
      setTimeout(() => {
        if (commentRef.current) {
          commentRef.current.classList.remove(styles.fadeIn);
        }
      }, 1000);
    }
  }, []);

  const handleLikeClick = () => {
    if (!isLiked) {
      // Apply like animation when liking
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    }
    onLike(!isLiked);
  };

  const handleReplySubmit = async (content: string) => {
    const success = await onReply(content);
    if (success) {
      setIsReplyFormOpen(false);
    }
    return success;
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to copy comment link
  const copyCommentLink = () => {
    // This would be implemented based on your app's URL structure
    const url = `${window.location.origin}/comments/${commentId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Comment link copied to clipboard!");
        setIsMenuOpen(false);
      })
      .catch((err) => {
        console.error("Failed to copy link", err);
      });
  };

  const reportComment = () => {
    // This would be implemented to show a report modal or form
    alert("Report functionality would be implemented here");
    setIsMenuOpen(false);
  };

  return (
    <div
      ref={commentRef}
      className={`${styles.comment} ${isExpertResponse ? styles.expertResponse : ""}`}
    >
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          <Avatar username={displayName} imageSrc={avatarUrl} size="small" />
          <div className={styles.authorInfo}>
            <div className={styles.nameRow}>
              <span className={styles.authorName}>{displayName}</span>
              {isExpertResponse && (
                <span className={styles.expertBadge}>
                  <FaCheck size={10} /> Expert
                </span>
              )}
            </div>
            {formattedDate && (
              <span className={styles.commentTime}>{formattedDate}</span>
            )}
          </div>
        </div>

        <div className={styles.commentActions} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Comment options"
          >
            <FaEllipsisH />
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={reportComment}>
                <FaFlag />
                Report Comment
              </button>
              <button className={styles.dropdownItem} onClick={copyCommentLink}>
                <FaLink />
                Copy Link
              </button>
              <button className={styles.dropdownItem}>
                <FaShare />
                Share Comment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.commentContent}>
        <p>{comment.content || ""}</p>
      </div>

      <div className={styles.commentFooter}>
        <button
          className={`${styles.actionButton} ${isLiked ? styles.liked : ""} ${isLikeAnimating ? styles.likeAnimating : ""}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{likeCount > 0 ? likeCount : ""}</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
          aria-label="Reply"
        >
          <FaReply />
          <span>Reply</span>
        </button>
      </div>

      {isReplyFormOpen && (
        <div className={styles.replyForm}>
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplyFormOpen(false)}
            placeholder={`Reply to ${displayName}...`}
          />
        </div>
      )}

      {/* Render replies with null check and depth tracking */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply: any) => (
            <Comment
              key={reply.comment_id || reply.id || Math.random().toString()}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
