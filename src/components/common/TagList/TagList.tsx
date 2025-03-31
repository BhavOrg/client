import React from "react";
import { Link } from "react-router";
import { Tag } from "../../../types/feed";
import styles from "./TagList.module.scss";

interface TagListProps {
  tags: Tag[];
  linkable?: boolean;
  className?: string;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  linkable = true,
  className = "",
}) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`${styles.tagList} ${className}`}>
      {tags.map((tag) =>
        linkable ? (
          <Link key={tag.id} to={`/tag/${tag.name}`} className={styles.tag}>
            {tag.name}
          </Link>
        ) : (
          <span key={tag.id} className={styles.tag}>
            {tag.name}
          </span>
        ),
      )}
    </div>
  );
};

export default TagList;
