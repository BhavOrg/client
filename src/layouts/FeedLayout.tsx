// FeedLayout.tsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import Navbar from "../components/common/Navbar/Navbar";
import Modal from "../components/common/Modal/Modal";
import PostCreationForm from "../components/features/Feed/PostCreationForm/PostCreationForm";
import {
  FaSortAmountDown,
  FaFilter,
  FaTags,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import styles from "./FeedLayout.module.scss";

const FeedLayout: React.FC = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // Handle post creation - will need to pass to child components
  const handleCreatePost = async (postData: any) => {
    try {
      // Call your API to create post
      // This should trigger a refresh in the child components
      setIsCreatePostModalOpen(false);
      // You might want to use a context or props to notify FeedPage
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <div className={styles.appWrapper}>
      <div className={styles.headerBackground}>
        <div className={styles.shapeLeft}></div>
        <div className={styles.shapeRight}></div>
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      <div className={styles.feedLayout}>
        <aside className={styles.leftSidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.profileSummary}>
              <div className={styles.avatarPlaceholder}></div>
              <h3>Welcome Back</h3>
              <p className={styles.anonymousTag}>Anonymous User</p>
            </div>

            <nav className={styles.feedNav}>
              <ul>
                <li className={styles.active}>
                  <Link to="/feed">
                    <span className={styles.icon}>📰</span>
                    <span className={styles.label}>All Posts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/feed/trending">
                    <span className={styles.icon}>🔥</span>
                    <span className={styles.label}>Trending</span>
                  </Link>
                </li>
                <li>
                  <Link to="/feed/saved">
                    <span className={styles.icon}>📌</span>
                    <span className={styles.label}>Saved Posts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/feed/my-posts">
                    <span className={styles.icon}>📝</span>
                    <span className={styles.label}>My Posts</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <button className={styles.supportButton}>
              Get Professional Support
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.createPostContainer}>
            <div
              className={styles.createPostInput}
              onClick={() => setIsCreatePostModalOpen(true)}
            >
              <div className={styles.userIcon}>
                <div className={styles.avatarPlaceholder}></div>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Share what's on your mind..."
                  className={styles.postInput}
                  readOnly // Make it clear it's not directly editable
                />
              </div>
              <button
                className={styles.postButton}
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className={styles.feedContentWrapper}>
            <Outlet />
          </div>
        </main>

        <aside className={styles.rightSidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <FaFilter className={styles.filterIcon} />
                <h3>Filters</h3>
              </div>

              <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input type="text" placeholder="Search posts..." />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHeader}>
                  <FaSortAmountDown className={styles.filterGroupIcon} />
                  <h4>Sort By</h4>
                </div>
                <div className={styles.filterOptions}>
                  <label className={styles.filterOption}>
                    <input
                      type="radio"
                      name="sort"
                      value="newest"
                      defaultChecked
                    />
                    <span>Newest</span>
                  </label>
                  <label className={styles.filterOption}>
                    <input type="radio" name="sort" value="popular" />
                    <span>Most Popular</span>
                  </label>
                  <label className={styles.filterOption}>
                    <input type="radio" name="sort" value="activity" />
                    <span>Recent Activity</span>
                  </label>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterGroupHeader}>
                  <FaFilter className={styles.filterGroupIcon} />
                  <h4>Show Posts</h4>
                </div>
                <div className={styles.filterOptions}>
                  <label className={styles.filterOption}>
                    <input type="checkbox" name="filter-all" defaultChecked />
                    <span>All Posts</span>
                  </label>
                  <label className={styles.filterOption}>
                    <input type="checkbox" name="filter-expert" />
                    <span>Expert Responses</span>
                  </label>
                  <label className={styles.filterOption}>
                    <input type="checkbox" name="filter-urgent" />
                    <span>Urgent Needs</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.tagSection}>
              <div className={styles.filterGroupHeader}>
                <FaTags className={styles.filterGroupIcon} />
                <h4>Popular Tags</h4>
              </div>
              <div className={styles.tagCloud}>
                <span className={styles.tag}>Anxiety</span>
                <span className={styles.tag}>Mindfulness</span>
                <span className={styles.tag}>Self-Care</span>
                <span className={styles.tag}>Depression</span>
                <span className={styles.tag}>Growth</span>
                <span className={styles.tag}>Relationships</span>
                <span className={styles.tag}>Work Stress</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        title="Share Your Thoughts"
        className={styles.createPostModal}
      >
        <PostCreationForm onSubmit={handleCreatePost} />
      </Modal>
    </div>
  );
};

export default FeedLayout;
