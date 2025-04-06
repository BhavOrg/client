// src/components/common/TagSelector/TagSelector.tsx
import React, { useState, useEffect, useMemo } from "react";
import { FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import {
  fetchTags,
  fetchPopularTags,
  createTag,
} from "../../../services/tagsService";
import { Tag } from "../../../types/feed";
import styles from "./TagSelector.module.scss";

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  availableTags?: Tag[] | null;
  maxTags?: number;
  showPopular?: boolean;
  allowCreation?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  availableTags: propTags,
  maxTags = 5,
  showPopular = true,
  allowCreation = true,
}) => {
  // Ensure availableTags is always an array
  const [availableTags, setAvailableTags] = useState<Tag[]>(() =>
    Array.isArray(propTags) ? propTags : [],
  );
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // Sync availableTags with prop changes
  useEffect(() => {
    if (Array.isArray(propTags)) {
      setAvailableTags(propTags);
    }
  }, [propTags]);

  // Fetch tags if not provided
  useEffect(() => {
    if (!propTags) {
      const loadTags = async () => {
        try {
          setIsLoading(true);
          const tags = await fetchTags();
          // Ensure tags is an array
          setAvailableTags(Array.isArray(tags) ? tags : []);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to load tags:", error);
          setIsLoading(false);
          setAvailableTags([]);
        }
      };

      loadTags();
    }
  }, [propTags]);

  // Fetch popular tags
  useEffect(() => {
    if (showPopular) {
      const loadPopularTags = async () => {
        try {
          const tags = await fetchPopularTags(10);
          // Ensure tags is an array
          setPopularTags(Array.isArray(tags) ? tags : []);
        } catch (error) {
          console.error("Failed to load popular tags:", error);
          setPopularTags([]);
        }
      };

      loadPopularTags();
    }
  }, [showPopular]);

  // Memoized filtered tags to prevent unnecessary re-renders
  const filteredTags = useMemo(() => {
    // Ensure availableTags is an array and use safe filtering
    const safeAvailableTags = Array.isArray(availableTags) ? availableTags : [];

    return safeAvailableTags
      .filter(
        (tag) =>
          tag &&
          tag.name &&
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedTags.some((t) => t.id === tag.id),
      )
      .slice(0, 10); // Limit to 10 results for better UX
  }, [availableTags, searchTerm, selectedTags]);

  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.length >= maxTags) return;

    if (!selectedTags.some((t) => t.id === tag.id)) {
      const newSelectedTags = [...selectedTags, tag];
      onChange(newSelectedTags);
    }
  };

  const handleTagRemove = (tagId: string) => {
    const newSelectedTags = selectedTags.filter((tag) => tag.id !== tagId);
    onChange(newSelectedTags);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const createdTag = await createTag(newTagName.trim());

      // Ensure createdTag is a valid Tag object
      if (createdTag && createdTag.id && createdTag.name) {
        // Update available tags and select the new tag
        setAvailableTags((prev) => [...prev, createdTag]);
        handleTagSelect(createdTag);

        // Reset creation state
        setNewTagName("");
        setIsCreatingTag(false);
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  // Determine if create tag option should be shown
  const showCreateOption =
    allowCreation &&
    searchTerm.trim() !== "" &&
    // Ensure safe array checking
    !(
      Array.isArray(availableTags) &&
      availableTags.some(
        (tag) =>
          tag &&
          tag.name &&
          tag.name.toLowerCase() === searchTerm.toLowerCase(),
      )
    ) &&
    !isCreatingTag;

  return (
    <div className={styles.tagSelector}>
      {selectedTags.length > 0 && (
        <div className={styles.selectedTags}>
          {selectedTags.map((tag) => (
            <div key={tag.id} className={styles.tagPill}>
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleTagRemove(tag.id)}
                className={styles.removeButton}
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.tagSearch}>
        <div className={styles.searchInput}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for tags or create new ones"
            disabled={selectedTags.length >= maxTags}
          />
        </div>

        {searchTerm && (
          <div className={styles.searchResults}>
            {isLoading ? (
              <div className={styles.loadingMessage}>Loading tags...</div>
            ) : filteredTags.length > 0 ? (
              <div className={styles.tagList}>
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelect(tag)}
                    className={styles.tagOption}
                    disabled={selectedTags.length >= maxTags}
                  >
                    {tag.name}
                    {tag.count && (
                      <span className={styles.tagCount}>({tag.count})</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>No tags found</div>
            )}

            {showCreateOption && (
              <button
                className={styles.createTagOption}
                onClick={() => setIsCreatingTag(true)}
                disabled={selectedTags.length >= maxTags}
              >
                <FaPlus />
                <span>Create tag "{searchTerm}"</span>
              </button>
            )}
          </div>
        )}

        {isCreatingTag && (
          <div className={styles.createTagForm}>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className={styles.createTagInput}
            />
            <div className={styles.createTagActions}>
              <button
                type="button"
                onClick={() => setIsCreatingTag(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTag}
                className={styles.createButton}
                disabled={!newTagName.trim()}
              >
                Create Tag
              </button>
            </div>
          </div>
        )}
      </div>

      {showPopular && popularTags.length > 0 && !searchTerm && (
        <div className={styles.popularTags}>
          <div className={styles.popularTagsHeader}>Popular Tags</div>
          <div className={styles.popularTagsList}>
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagSelect(tag)}
                className={`${styles.tagOption} ${styles.popularTag}`}
                disabled={
                  selectedTags.length >= maxTags ||
                  selectedTags.some((t) => t.id === tag.id)
                }
              >
                {tag.name}
                {tag.count && (
                  <span className={styles.tagCount}>({tag.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length >= maxTags && (
        <div className={styles.maxTagsMessage}>
          Maximum of {maxTags} tags reached
        </div>
      )}
    </div>
  );
};

export default TagSelector;
