import React, { useState } from "react";
import { FaFilter, FaSort, FaTag, FaExclamationTriangle } from "react-icons/fa";
import TagSelector from "../../../common/TagSelector/TagSelector";
import { SortOption, FilterOption, Tag } from "../../../../types/feed";
import styles from "./FeedFilters.module.scss";

interface FeedFiltersProps {
  sortOption: SortOption;
  filterOption: FilterOption | null;
  selectedTags: Tag[];
  onSortChange: (option: SortOption) => void;
  onFilterChange: (option: FilterOption | null) => void;
  onTagSelect: (tags: Tag[]) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
  sortOption,
  filterOption,
  selectedTags,
  onSortChange,
  onFilterChange,
  onTagSelect,
}) => {
  const [showTagFilters, setShowTagFilters] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
    { value: "mostComments", label: "Most Comments" },
  ];

  const filterOptions: { value: FilterOption | null; label: string }[] = [
    { value: null, label: "All Posts" },
    { value: "needsSupport", label: "Needs Support" },
    { value: "expertResponses", label: "Expert Responses" },
    { value: "myPosts", label: "My Posts" },
    { value: "saved", label: "Saved Posts" },
  ];

  const toggleTagFilters = () => {
    setShowTagFilters(!showTagFilters);
  };

  const handleTagChange = (tags: Tag[]) => {
    onTagSelect(tags);
  };

  return (
    <div className={styles.feedFilters}>
      <h3 className={styles.filtersTitle}>
        <FaFilter />
        <span>Filter Posts</span>
      </h3>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>
          <FaSort />
          <span>Sort By</span>
        </h4>
        <div className={styles.optionsContainer}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.optionButton} ${sortOption === option.value ? styles.active : ""}`}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>
          <FaExclamationTriangle />
          <span>Filter By</span>
        </h4>
        <div className={styles.optionsContainer}>
          {filterOptions.map((option) => (
            <button
              key={option.value || "all"}
              className={`${styles.optionButton} ${filterOption === option.value ? styles.active : ""}`}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <button className={styles.tagFilterToggle} onClick={toggleTagFilters}>
          <h4 className={styles.sectionTitle}>
            <FaTag />
            <span>Filter By Tags</span>
          </h4>
          <span className={styles.toggleArrow}>
            {showTagFilters ? "▲" : "▼"}
          </span>
        </button>

        {showTagFilters && (
          <div className={styles.tagSelectorContainer}>
            <TagSelector
              selectedTags={selectedTags}
              onChange={handleTagChange}
              showPopular={true}
              allowCreation={false}
            />
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className={styles.selectedTagsList}>
            <div className={styles.tagsRow}>
              {selectedTags.map((tag) => (
                <span key={tag.id} className={styles.tagPill}>
                  {tag.name}
                  <button
                    onClick={() =>
                      handleTagChange(
                        selectedTags.filter((t) => t.id !== tag.id),
                      )
                    }
                    className={styles.removeTagButton}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => handleTagChange([])}
                className={styles.clearTagsButton}
              >
                Clear all tags
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedFilters;
