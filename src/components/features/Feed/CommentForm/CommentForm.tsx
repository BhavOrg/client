// src/components/features/Feed/CommentForm/CommentForm.tsx
import React, { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import styles from "./CommentForm.module.scss";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isReply?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  isReply = false,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.commentInput}
        value={content}
        onChange={handleContentChange}
        placeholder={isReply ? "Write a reply..." : "Add a comment..."}
        rows={isReply ? 2 : 3}
      />

      <div className={styles.formActions}>
        {isReply && onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            <FaTimes />
            <span>Cancel</span>
          </button>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!content.trim() || isSubmitting}
        >
          <FaPaperPlane />
          <span>
            {isSubmitting ? "Posting..." : isReply ? "Reply" : "Comment"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
