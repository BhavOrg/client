// CommentForm.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaRegSmile,
  FaImage,
  FaLink,
} from "react-icons/fa";
import styles from "./CommentForm.module.scss";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  onCancel?: () => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const success = await onSubmit(content.trim());
      if (success) {
        setContent("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      if (content.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form
      className={`${styles.commentForm} ${isFocused ? styles.focused : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          className={styles.commentInput}
          placeholder={placeholder}
          value={content}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
          disabled={isSubmitting}
        />
        <div className={styles.toolbox}>
          <button
            type="button"
            className={styles.toolButton}
            disabled={isSubmitting}
            aria-label="Add emoji"
          >
            <FaRegSmile />
          </button>

          <button
            type="button"
            className={styles.toolButton}
            disabled={isSubmitting}
            aria-label="Attach image"
          >
            <FaImage />
          </button>

          <button
            type="button"
            className={styles.toolButton}
            disabled={isSubmitting}
            aria-label="Add link"
          >
            <FaLink />
          </button>
        </div>
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
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
          <span>{isSubmitting ? "Sending..." : "Comment"}</span>
        </button>
      </div>

      {isFocused && (
        <div className={styles.formTip}>Press Ctrl+Enter to submit</div>
      )}
    </form>
  );
};

export default CommentForm;
