import React from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import {
  FaComment,
  FaHeart,
  FaUserMd,
  FaAt,
  FaTag,
  FaBell,
} from "react-icons/fa";
import { Notification, NotificationType } from "../../../../types/feed";
import { markNotificationAsRead } from "../../../../services/notificationsService";
import styles from "./NotificationItem.module.scss";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const { id, type, message, isRead, createdAt, relatedPostId } = notification;

  const handleClick = async () => {
    if (!isRead) {
      try {
        await markNotificationAsRead(id);
        onMarkAsRead(id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "comment":
        return <FaComment className={styles.commentIcon} />;
      case "like":
        return <FaHeart className={styles.likeIcon} />;
      case "expertResponse":
        return <FaUserMd className={styles.expertIcon} />;
      case "mention":
        return <FaAt className={styles.mentionIcon} />;
      case "tag":
        return <FaTag className={styles.tagIcon} />;
      case "system":
        return <FaBell className={styles.systemIcon} />;
      default:
        return <FaBell className={styles.defaultIcon} />;
    }
  };

  const getNotificationLink = () => {
    if (relatedPostId) {
      return `/post/${relatedPostId}`;
    }
    return "#";
  };

  return (
    <Link
      to={getNotificationLink()}
      className={`${styles.notification} ${!isRead ? styles.unread : ""}`}
      onClick={handleClick}
    >
      <div className={styles.iconContainer}>{getNotificationIcon(type)}</div>

      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <span className={styles.time}>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>

      {!isRead && <div className={styles.unreadIndicator} />}
    </Link>
  );
};

export default NotificationItem;
