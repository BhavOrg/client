import React, { useState, useEffect } from "react";
import { FaFilter, FaSort, FaTags, FaSearch } from "react-icons/fa";
import { SortOption, FilterOption, Tag } from "../../../../types/feed";
import { fetchPopularTags } from "../../../../services/tagsService";
import TagSelector from "../../../../components/common/TagSelector/TagSelector";
import styles from "./FeedFilters.module.scss";

interface FeedFiltersProps {
  onFilterChange: (filters: {
    sort?: SortOption;
    filter?: FilterOption | null;
    tags?: string[];
    search?: string;
  }) => void;
  currentFilters: {
    sort: SortOption;
    filter: FilterOption | null;
    tags: string[];
    search: string;
  };
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
  onFilterChange,
  currentFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    currentFilters.tags.map((tagName) => ({ id: tagName, name: tagName })),
  );

  // Fetch popular tags on component mount
  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        const tags = await fetchPopularTags();
        setPopularTags(tags);
      } catch (error) {
        console.error("Failed to load popular tags:", error);
      }
    };

    loadPopularTags();
  }, []);

  const handleSortChange = (sort: SortOption) => {
    onFilterChange({ sort });
  };

  const handleFilterChange = (filter: FilterOption | null) => {
    onFilterChange({ filter });
  };

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    onFilterChange({ tags: tags.map((tag) => tag.name) });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.feedFilters}>
      <div className={styles.filterHeader}>
        <button
          className={styles.expandButton}
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <FaFilter /> Filters {isExpanded ? "▲" : "▼"}
        </button>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <FaSearch />
            </button>
          </div>
        </form>
      </div>

      {isExpanded && (
        <div className={styles.expandedFilters}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>
              <FaSort /> Sort By
            </h3>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={currentFilters.sort === "newest"}
                  onChange={() => handleSortChange("newest")}
                />
                <span>Newest</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="popular"
                  checked={currentFilters.sort === "popular"}
                  onChange={() => handleSortChange("popular")}
                />
                <span>Most Popular</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="trending"
                  checked={currentFilters.sort === "trending"}
                  onChange={() => handleSortChange("trending")}
                />
                <span>Trending</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="sort"
                  value="mostComments"
                  checked={currentFilters.sort === "mostComments"}
                  onChange={() => handleSortChange("mostComments")}
                />
                <span>Most Comments</span>
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>
              <FaFilter /> Show Posts
            </h3>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="filter"
                  value="all"
                  checked={currentFilters.filter === null}
                  onChange={() => handleFilterChange(null)}
                />
                <span>All Posts</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="filter"
                  value="needsSupport"
                  checked={currentFilters.filter === "needsSupport"}
                  onChange={() => handleFilterChange("needsSupport")}
                />
                <span>Needs Support</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="filter"
                  value="expertResponses"
                  checked={currentFilters.filter === "expertResponses"}
                  onChange={() => handleFilterChange("expertResponses")}
                />
                <span>Expert Responses</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="filter"
                  value="myPosts"
                  checked={currentFilters.filter === "myPosts"}
                  onChange={() => handleFilterChange("myPosts")}
                />
                <span>My Posts</span>
              </label>
              <label className={styles.filterOption}>
                <input
                  type="radio"
                  name="filter"
                  value="saved"
                  checked={currentFilters.filter === "saved"}
                  onChange={() => handleFilterChange("saved")}
                />
                <span>Saved Posts</span>
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>
              <FaTags /> Filter by Tags
            </h3>
            <TagSelector
              selectedTags={selectedTags}
              onChange={handleTagsChange}
              availableTags={popularTags}
              maxTags={5}
              showPopular={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedFilters;
