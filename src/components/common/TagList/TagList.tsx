import React from "react";
import { Link } from "react-router";
import { Tag } from "../../../types/feed";
import styles from "./TagList.module.scss";

interface TagListProps {
  tags: Tag[];
  linkable?: boolean;
  removable?: boolean;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "small" | "default" | "large";
  active?: boolean;
  className?: string;
  onRemoveTag?: (tagId: string) => void;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  linkable = false,
  removable = false,
  variant = "default",
  size = "default",
  active = false,
  className = "",
  onRemoveTag,
}) => {
  if (!tags || tags.length === 0) return null;

  const renderTag = (tag: Tag) => {
    const tagClasses = [
      styles.tag,
      styles[variant],
      active ? styles.active : "",
      linkable ? styles.linkable : "",
      removable ? styles.removable : "",
      size !== "default" ? styles[size] : "",
    ]
      .filter(Boolean)
      .join(" ");

    const tagContent = (
      <>
        {tag.name}
        {tag.count !== undefined && (
          <span className={styles.tagCount}>({tag.count})</span>
        )}
      </>
    );

    if (linkable) {
      return (
        <Link
          key={tag.id}
          to={`/tag/${tag.name}`}
          className={`${tagClasses} ${className}`}
        >
          {tagContent}
          {removable && onRemoveTag && (
            <button
              className={styles.removeButton}
              onClick={(e) => {
                e.preventDefault();
                onRemoveTag(tag.id);
              }}
            >
              ×
            </button>
          )}
        </Link>
      );
    }

    return (
      <span key={tag.id} className={`${tagClasses} ${className}`}>
        {tagContent}
        {removable && onRemoveTag && (
          <button
            className={styles.removeButton}
            onClick={() => onRemoveTag(tag.id)}
          >
            ×
          </button>
        )}
      </span>
    );
  };

  return <div className={styles.tagList}>{tags.map(renderTag)}</div>;
};

export default TagList;
