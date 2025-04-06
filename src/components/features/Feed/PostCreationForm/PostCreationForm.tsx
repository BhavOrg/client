import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaTags,
  FaPaperPlane,
  FaLock,
  FaLockOpen,
  FaRegKeyboard,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Button from "../../../common/Button/Button";
import TagSelector from "../../../common/TagSelector/TagSelector";
import { createPost } from "../../../../services/PostsService";
import useAuth from "../../../../hooks/useAuth";
import { Tag, PostCreationData, Post } from "../../../../types/feed";
import styles from "./PostCreationForm.module.scss";

interface PostCreationFormProps {
  onSubmit?: (postData: PostCreationData) => void;
  onClose?: () => void;
  initialData?: Partial<PostCreationData>;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  onSubmit,
  onClose,
  initialData = {},
}) => {
  const { isAuthenticated } = useAuth();

  // Ensure all properties have default values
  const [formData, setFormData] = useState<PostCreationData>({
    content: initialData.content || "",
    isAnonymous: initialData.isAnonymous ?? true,
    tags: initialData.tags || [],
    hasTriggerWarning: initialData.hasTriggerWarning ?? false,
    triggerWarningText: initialData.triggerWarningText || "",
  });

  // Modify tag mapping to ensure compatibility
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    (initialData.tags || []).map((tagName) => ({
      id: tagName,
      name: tagName,
      data: {} as any, // Add an empty data object to match Tag type
    })),
  );

  const [showTriggerWarningInput, setShowTriggerWarningInput] = useState(
    initialData.hasTriggerWarning ?? false,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [charCount, setCharCount] = useState(initialData.content?.length || 0);

  // Maximum character limit
  const MAX_CHARS = 1000;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.content.trim()) {
      newErrors.content = "Please share your thoughts before posting";
    } else if (formData.content.length > MAX_CHARS) {
      newErrors.content = `Post cannot exceed ${MAX_CHARS} characters`;
    }

    if (formData.hasTriggerWarning && !formData.triggerWarningText?.trim()) {
      newErrors.triggerWarningText =
        "Please provide a trigger warning description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setFormData({
        ...formData,
        content: newContent,
      });
      setCharCount(newContent.length);

      // Clear error when user types
      if (errors.content) {
        setErrors({
          ...errors,
          content: "",
        });
      }
    }
  };

  const handleAnonymousToggle = () => {
    setFormData({
      ...formData,
      isAnonymous: !formData.isAnonymous,
    });
  };

  const handleTriggerWarningToggle = () => {
    const newState = !formData.hasTriggerWarning;
    setFormData({
      ...formData,
      hasTriggerWarning: newState,
      // Clear trigger warning text if toggled off
      triggerWarningText: newState ? formData.triggerWarningText : "",
    });
    setShowTriggerWarningInput(newState);
  };

  const handleTriggerWarningTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      triggerWarningText: e.target.value,
    });

    // Clear error when user types
    if (errors.triggerWarningText) {
      setErrors({
        ...errors,
        triggerWarningText: "",
      });
    }
  };

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    setFormData({
      ...formData,
      tags: tags.map((tag) => tag.name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication before submission
    if (!isAuthenticated) {
      setErrors({
        submit: "You need to log in to create a post.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare post data for API
      const postData: PostCreationData = {
        content: formData.content.trim(),
        isAnonymous: formData.isAnonymous,
        tags: formData.tags,
        hasTriggerWarning: formData.hasTriggerWarning,
        triggerWarningText: formData.hasTriggerWarning
          ? formData.triggerWarningText?.trim()
          : undefined,
      };

      // First try to create post via service
      const newPost = await createPost(postData);

      // If onSubmit callback is provided, call it with original creation data
      if (onSubmit) {
        onSubmit(postData);
      }

      // Close the form or modal if possible
      if (onClose) {
        onClose();
      }

      // Reset form
      setFormData({
        content: "",
        isAnonymous: true,
        tags: [],
        hasTriggerWarning: false,
        triggerWarningText: "",
      });
      setSelectedTags([]);
      setShowTriggerWarningInput(false);
      setCharCount(0);
    } catch (error: any) {
      // Handle specific API errors
      if (error.response?.status === 401) {
        setErrors({
          submit: "Authentication failed. Please log in again.",
        });
      } else {
        setErrors({
          submit:
            error.response?.data?.message ||
            "Failed to create post. Please try again.",
        });
      }

      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.postForm}>
      <div className={styles.formGroup}>
        <textarea
          className={`${styles.contentInput} ${errors.content ? styles.hasError : ""}`}
          placeholder="Share what's on your mind..."
          value={formData.content}
          onChange={handleContentChange}
          rows={6}
          maxLength={MAX_CHARS}
        />
        {errors.content && (
          <div className={styles.errorMessage}>
            <FaExclamationTriangle />
            <span>{errors.content}</span>
          </div>
        )}
        <div className={styles.charCounter}>
          <FaRegKeyboard />
          <span>
            {charCount}/{MAX_CHARS} characters
          </span>
        </div>
      </div>

      <div className={styles.formOptions}>
        <div className={styles.toggleSection}>
          <div className={styles.toggleLabel}>
            {formData.isAnonymous ? (
              <>
                <FaEyeSlash /> Anonymous Post
              </>
            ) : (
              <>
                <FaEye /> Public Post
              </>
            )}
          </div>

          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={handleAnonymousToggle}
            />
            <span className={styles.slider}>
              <span className={styles.toggleIcon}>
                {formData.isAnonymous ? <FaLock /> : <FaLockOpen />}
              </span>
            </span>
          </label>
        </div>

        <div className={styles.toggleSection}>
          <div className={styles.toggleLabel}>
            <FaExclamationTriangle />
            <span>Trigger Warning</span>
          </div>

          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={formData.hasTriggerWarning}
              onChange={handleTriggerWarningToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {showTriggerWarningInput && (
          <div className={`${styles.formGroup} ${styles.triggerWarningGroup}`}>
            <input
              type="text"
              className={`${styles.triggerWarningInput} ${errors.triggerWarningText ? styles.hasError : ""}`}
              placeholder="Describe the trigger warning (e.g., self-harm, abuse)"
              value={formData.triggerWarningText}
              onChange={handleTriggerWarningTextChange}
            />
            {errors.triggerWarningText && (
              <div className={styles.errorMessage}>
                <FaExclamationTriangle />
                <span>{errors.triggerWarningText}</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.tagsSection}>
          <div className={styles.tagsSectionHeader}>
            <FaTags />
            <span>Add tags to help others find your post</span>
          </div>
          <TagSelector
            selectedTags={selectedTags}
            onChange={handleTagsChange}
            maxTags={5}
            showPopular={true}
            allowCreation={true}
          />
        </div>
      </div>

      {errors.submit && (
        <div className={styles.errorMessage}>
          <FaExclamationTriangle />
          <span>{errors.submit}</span>
        </div>
      )}

      <div className={styles.privacyIndicator}>
        {formData.isAnonymous ? (
          <FaLock className={styles.lockIcon} />
        ) : (
          <FaLockOpen className={styles.lockIcon} />
        )}
        <span>
          {formData.isAnonymous
            ? "Your identity will remain anonymous"
            : "You are posting with your username"}
        </span>
      </div>

      <div className={styles.formActions}>
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mr-3"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Posting..."
          disabled={!formData.content.trim() || !isAuthenticated}
        >
          <FaPaperPlane /> Post
        </Button>
      </div>
    </form>
  );
};

export default PostCreationForm;
