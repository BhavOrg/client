// src/components/features/Feed/PostCreationForm/PostCreationForm.tsx
import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTag, FaLock, FaUnlock } from "react-icons/fa";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import TagSelector from "../../../common/TagSelector/TagSelector";
import { fetchTags } from "../../../../services/tagsService";
import { Tag } from "../../../../types/feed";
import styles from "./PostCreationForm.module.scss";

interface PostCreationFormProps {
  onSubmit: (postData: PostData) => void;
}

interface PostData {
  content: string;
  isAnonymous: boolean;
  tags: string[];
  hasTriggerWarning: boolean;
  triggerWarningText: string;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false);
  const [triggerWarningText, setTriggerWarningText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 1000;

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (err) {
        setError(
          "Failed to load tags. You can still create a post without tags.",
        );
      }
    };

    loadTags();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharCount(newContent.length);
  };

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
  };

  const handleTriggerWarningChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTriggerWarningText(e.target.value);
  };

  const toggleAnonymity = () => {
    setIsAnonymous(!isAnonymous);
  };

  const toggleTriggerWarning = () => {
    setHasTriggerWarning(!hasTriggerWarning);
    if (!hasTriggerWarning) {
      setTriggerWarningText("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Please enter some content for your post.");
      return;
    }

    if (hasTriggerWarning && !triggerWarningText.trim()) {
      setError("Please provide a description for the trigger warning.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        content,
        isAnonymous,
        tags: selectedTags.map((tag) => tag.id),
        hasTriggerWarning,
        triggerWarningText: hasTriggerWarning ? triggerWarningText : "",
      });

      // Reset form after successful submission
      setContent("");
      setSelectedTags([]);
      setHasTriggerWarning(false);
      setTriggerWarningText("");
      setCharCount(0);
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.postForm} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <div className={styles.privacyToggle}>
          <button
            type="button"
            onClick={toggleAnonymity}
            className={`${styles.privacyButton} ${isAnonymous ? styles.active : ""}`}
          >
            <FaLock />
            <span>Anonymous</span>
          </button>
          <button
            type="button"
            onClick={toggleAnonymity}
            className={`${styles.privacyButton} ${!isAnonymous ? styles.active : ""}`}
          >
            <FaUnlock />
            <span>Public</span>
          </button>
        </div>

        <div className={styles.triggerWarningToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={hasTriggerWarning}
              onChange={toggleTriggerWarning}
              className={styles.toggleCheckbox}
            />
            <span className={styles.toggleSwitch}></span>
            <span className={styles.toggleText}>
              <FaExclamationTriangle /> Add Trigger Warning
            </span>
          </label>
        </div>
      </div>

      {hasTriggerWarning && (
        <div className={styles.triggerWarningInput}>
          <Input
            type="text"
            placeholder="Describe the trigger warning (e.g., 'Discussion of anxiety attacks')"
            value={triggerWarningText}
            onChange={handleTriggerWarningChange}
            icon={<FaExclamationTriangle />}
          />
        </div>
      )}

      <div className={styles.contentArea}>
        <textarea
          placeholder="Share your thoughts, experiences, or questions with the community..."
          value={content}
          onChange={handleContentChange}
          className={styles.textarea}
          maxLength={maxCharCount}
          required
        />
        <div className={styles.charCounter}>
          <span
            className={charCount > maxCharCount * 0.8 ? styles.warning : ""}
          >
            {charCount} / {maxCharCount}
          </span>
        </div>
      </div>

      <div className={styles.tagsSection}>
        <div className={styles.tagsHeader}>
          <FaTag />
          <span>Add relevant tags to help others find your post</span>
        </div>
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onChange={handleTagsChange}
          maxTags={5}
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.formActions}>
        <Button
          type="submit"
          className={styles.submitButton}
          disabled={loading || content.trim().length === 0}
        >
          {loading ? "Posting..." : "Post to Community"}
        </Button>
      </div>
    </form>
  );
};

export default PostCreationForm;
