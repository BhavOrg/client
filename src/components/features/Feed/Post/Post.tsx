import React, { useState } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaExclamationTriangle,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { Post as PostType, UrgencyLevel, Tag } from "../../../../types/feed";
import Avatar from "../../../common/Avatar/Avatar";
import TagList from "../../../common/TagList/TagList";
import CommentSection from "../CommentSection/CommentSection";
import styles from "./Post.module.scss";

interface PostProps {
  post: PostType;
  onLike: (postId: string, isLiked: boolean) => void;
  onSave?: (postId: string, isSaved: boolean) => void;
  showComments?: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  onLike,
  onSave,
  showComments = false,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(showComments);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Handle compatibility with both API and client-side formats
  const postId = post.post_id || post.id || "";
  const isAnonymous = post.is_anonymous || post.isAnonymous || false;
  const hasExpertResponse =
    post.expert_responded || post.hasExpertResponse || false;
  const urgencyLevel = post.urgency_level || "low";
  const createdAt = post.created_at || "";
  const content = post.content || "";

  // Handle likes count from different fields
  const likeCount = post.upvotes || post.likeCount || 0;
  const commentCount = post.comment_count || 0;
  const isLiked = post.isLikedByUser || false;
  const isSaved = post.isSavedByUser || false;

  // Handle tags from different formats
  let formattedTags: Tag[] = [];
  if (Array.isArray(post.tags)) {
    if (post.tags.length > 0) {
      if (typeof post.tags[0] === "string") {
        // If tags are strings, convert them to Tag objects
        formattedTags = (post.tags as string[]).map((tag) => ({
          id: tag,
          name: tag,
        }));
      } else {
        // If tags are already Tag objects
        formattedTags = post.tags as Tag[];
      }
    }
  }

  const handleLikeClick = () => {
    onLike(postId, !isLiked);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(postId, !isSaved);
    }
  };

  const handleCommentsToggle = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleOptionsToggle = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  // Helper function to get urgency indicator classes
  const getUrgencyClass = (level: UrgencyLevel): string => {
    switch (level) {
      case "critical":
        return styles.urgencyCritical;
      case "high":
        return styles.urgencyHigh;
      case "medium":
        return styles.urgencyMedium;
      default:
        return styles.urgencyLow;
    }
  };

  // Format the relative time (e.g., "3 hours ago")
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  return (
    <div className={styles.post}>
      {/* Urgency indicator */}
      <div
        className={`${styles.urgencyIndicator} ${getUrgencyClass(urgencyLevel as UrgencyLevel)}`}
      />

      <div className={styles.postHeader}>
        <div className={styles.postAuthor}>
          {post.author ? (
            <Avatar
              username={isAnonymous ? "Anonymous" : post.author.username}
              imageSrc={post.author.avatarUrl}
              size="medium"
            />
          ) : (
            <Avatar username="Anonymous" size="medium" />
          )}
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {isAnonymous ? "Anonymous" : post.author?.username || "User"}
            </span>
            <span className={styles.postDate}>{formattedDate}</span>
          </div>
        </div>

        <div className={styles.postActions}>
          {hasExpertResponse && (
            <div className={styles.expertResponseBadge}>Expert Response</div>
          )}
          <button
            className={styles.optionsButton}
            onClick={handleOptionsToggle}
            aria-label="Post options"
          >
            <FaEllipsisH />
          </button>

          {isOptionsOpen && (
            <div className={styles.optionsMenu}>
              <button className={styles.optionMenuItem}>Report Post</button>
              <button className={styles.optionMenuItem}>Copy Link</button>
              {/* Additional options */}
            </div>
          )}
        </div>
      </div>

      {post.hasTriggerWarning && (
        <div className={styles.triggerWarning}>
          <FaExclamationTriangle />
          <span>
            Trigger Warning:{" "}
            {post.triggerWarningText ||
              "This post may contain sensitive content"}
          </span>
        </div>
      )}

      <div className={styles.postContent}>
        <p>{content}</p>
      </div>

      {formattedTags.length > 0 && (
        <div className={styles.postTags}>
          <TagList tags={formattedTags} />
        </div>
      )}

      <div className={styles.postFooter}>
        <div className={styles.postStats}>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </button>

          <button
            className={styles.commentButton}
            onClick={handleCommentsToggle}
            aria-label="View comments"
          >
            <FaComment />
            <span>{commentCount}</span>
          </button>

          {onSave && (
            <button
              className={`${styles.saveButton} ${isSaved ? styles.saved : ""}`}
              onClick={handleSaveClick}
              aria-label={isSaved ? "Unsave post" : "Save post"}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          )}
        </div>
      </div>

      {isCommentsOpen && (
        <div className={styles.commentsContainer}>
          <CommentSection postId={postId} />
        </div>
      )}
    </div>
  );
};

export default Post;
