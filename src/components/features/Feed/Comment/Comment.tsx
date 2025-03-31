// src/components/features/Feed/Comment/Comment.tsx
import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaReply,
  FaUserCircle,
  FaEllipsisV,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Avatar from "../../../common/Avatar/Avatar";
import Button from "../../../common/Button/Button";
import { Comment as CommentType } from "../../../../types/feed";
import { likeComment } from "../../../../services/commentsService";
import styles from "./Comment.module.scss";

interface CommentProps {
  comment: CommentType;
  onReplyClick: () => void;
  isReply?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onReplyClick,
  isReply = false,
}) => {
  const [isLiked, setIsLiked] = useState(comment.isLikedByUser);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [showDropdown, setShowDropdown] = useState(false);

  const { author, content, createdAt, isExpertResponse, isAnonymous } = comment;

  const handleLikeClick = async () => {
    try {
      const newLikedState = !isLiked;
      await likeComment(comment.id, newLikedState);
      setIsLiked(newLikedState);
      setLikeCount((prevCount) =>
        newLikedState ? prevCount + 1 : prevCount - 1,
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleReportClick = () => {
    // Implement report functionality
    console.log("Report comment:", comment.id);
    setShowDropdown(false);
  };

  return (
    <div
      className={`${styles.comment} ${isReply ? styles.reply : ""} ${isExpertResponse ? styles.expertResponse : ""}`}
    >
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          <Avatar
            username={isAnonymous ? "Anonymous" : author.username}
            imageSrc={isAnonymous ? undefined : author.avatarUrl}
            size="small"
          />
          <div className={styles.authorInfo}>
            <div className={styles.nameRow}>
              <span className={styles.authorName}>
                {isAnonymous ? "Anonymous" : author.username}
              </span>
              {isExpertResponse && (
                <span className={styles.expertBadge}>Expert</span>
              )}
            </div>
            <span className={styles.commentTime}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className={styles.commentActions}>
          <button
            className={styles.menuButton}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaEllipsisV />
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              <button
                className={styles.dropdownItem}
                onClick={handleReportClick}
              >
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.commentContent}>
        <p>{content}</p>
      </div>

      <div className={styles.commentFooter}>
        <Button
          onClick={handleLikeClick}
          className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{likeCount}</span>
        </Button>

        <Button onClick={onReplyClick} className={styles.actionButton}>
          <FaReply />
          <span>Reply</span>
        </Button>
      </div>
    </div>
  );
};

export default Comment;
