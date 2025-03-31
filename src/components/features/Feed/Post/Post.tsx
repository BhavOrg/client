import React, { useState } from "react";
import { Link } from "react-router";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaEye,
  FaEyeSlash,
  FaShare,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Button from "../../../common/Button/Button";
import Avatar from "../../../common/Avatar/Avatar";
import TagList from "../../../common/TagList/TagList";
import CommentSection from "../CommentSection/CommentSection";
import { Post as PostType } from "../../../../types/feed";
import styles from "./Post.module.scss";

interface PostProps {
  post: PostType;
  onLike: (postId: string, isLiked: boolean) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike }) => {
  const [isContentVisible, setIsContentVisible] = useState(
    !post.hasTriggerWarning,
  );
  const [showComments, setShowComments] = useState(false);

  const {
    id,
    author,
    content,
    createdAt,
    tags,
    likeCount,
    commentCount,
    isLikedByUser,
    hasTriggerWarning,
    triggerWarningText,
    urgencyLevel,
    hasExpertResponse,
    isAnonymous,
  } = post;

  const handleLikeClick = () => {
    onLike(id, !isLikedByUser);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleToggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    // You could add a toast notification here
  };

  const renderUrgencyIndicator = () => {
    if (!urgencyLevel || urgencyLevel === "low") return null;

    const labels = {
      medium: "Support Needed",
      high: "Urgent Support",
      critical: "Critical",
    };

    const className = {
      medium: styles.medium,
      high: styles.high,
      critical: styles.critical,
    };

    return (
      <div
        className={`${styles.urgencyIndicator} ${className[urgencyLevel as keyof typeof className]}`}
      >
        <FaExclamationTriangle />
        <span>{labels[urgencyLevel as keyof typeof labels]}</span>
      </div>
    );
  };

  return (
    <div
      className={`${styles.post} ${urgencyLevel && urgencyLevel !== "low" ? styles[urgencyLevel] : ""}`}
    >
      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          <Avatar
            username={isAnonymous ? "Anonymous" : author.username}
            imageSrc={isAnonymous ? undefined : author.avatarUrl}
            size="medium"
          />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {isAnonymous ? "Anonymous" : author.username}
            </span>
            <span className={styles.postTime}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className={styles.postMeta}>
          {hasExpertResponse && (
            <div className={styles.expertBadge}>Expert Response</div>
          )}
          {renderUrgencyIndicator()}
        </div>
      </div>

      {hasTriggerWarning && (
        <div className={styles.triggerWarning}>
          <div className={styles.warningHeader}>
            <FaExclamationTriangle />
            <span>Trigger Warning</span>
          </div>
          {triggerWarningText && <p>{triggerWarningText}</p>}
          <Button
            onClick={handleToggleContent}
            className={styles.warningButton}
          >
            {isContentVisible ? (
              <>
                <FaEyeSlash /> Hide Content
              </>
            ) : (
              <>
                <FaEye /> View Content
              </>
            )}
          </Button>
        </div>
      )}

      {isContentVisible && (
        <>
          <div className={styles.postContent}>
            <p>{content}</p>
          </div>

          {tags && tags.length > 0 && (
            <div className={styles.tagsContainer}>
              <TagList tags={tags} />
            </div>
          )}
        </>
      )}

      <div className={styles.postActions}>
        <Button
          onClick={handleLikeClick}
          className={`${styles.actionButton} ${isLikedByUser ? styles.liked : ""}`}
        >
          {isLikedByUser ? <FaHeart /> : <FaRegHeart />}
          <span>{likeCount}</span>
        </Button>

        <Button onClick={handleToggleComments} className={styles.actionButton}>
          <FaComment />
          <span>{commentCount}</span>
        </Button>

        <Button onClick={handleShare} className={styles.actionButton}>
          <FaShare />
          <span>Share</span>
        </Button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <CommentSection postId={id} hasExpertResponse={hasExpertResponse} />
        </div>
      )}
    </div>
  );
};

export default Post;
