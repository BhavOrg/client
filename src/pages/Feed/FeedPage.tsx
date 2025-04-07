import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Container from "../../components/common/Container/Container";
import PostCreationForm from "../../components/features/Feed/PostCreationForm/PostCreationForm";
import Post from "../../components/features/Feed/Post/Post";
import Loader from "../../components/common/Loader/Loader";
import Modal from "../../components/common/Modal/Modal";
import Button from "../../components/common/Button/Button";
import useAuth from "../../hooks/useAuth";
import {
  fetchPosts,
  createPost,
  likePost,
  savePost,
} from "../../services/PostsService";
import {
  Post as PostType,
  PostCreationData,
  PaginatedResponse,
} from "../../types/feed";
import styles from "./FeedPage.module.scss";

const FeedPage: React.FC = () => {
  const { user, isAuthenticated, triggerLogin } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createPostError, setCreatePostError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch posts on component mount and when dependencies change
  useEffect(() => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    const fetchFeedData = async () => {
      try {
        // Use the page parameter for pagination
        const response = await fetchPosts({ page });

        if (page === 1) {
          setPosts(response.data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
        }

        setHasMore(response.hasNextPage);
        setLoading(false);
        setLoadingMore(false);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchFeedData();
  }, [page, refreshTrigger]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return;

    // Disconnect previous observer
    if (observer.current) observer.current.disconnect();

    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        // If the last element is visible and there's more content to load
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: "100px", // Start loading before the element is in view
      },
    );

    // Observe the last post element
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, posts]);

  const handleRefresh = () => {
    setPage(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreatePost = async (postData: PostCreationData) => {
    // Clear any previous errors
    setCreatePostError(null);

    // Check authentication before attempting to create post
    if (!isAuthenticated) {
      // Trigger login modal
      triggerLogin();
      setCreatePostError("Please log in to create a post.");
      return;
    }

    try {
      await createPost(postData);
      setIsCreatePostModalOpen(false);
      handleRefresh();
    } catch (err: any) {
      console.error("Failed to create post", err);

      // Handle specific authentication errors
      if (err.response?.status === 401) {
        setCreatePostError("Authentication failed. Please log in again.");
        triggerLogin();
      } else {
        // Handle other potential errors
        setCreatePostError(
          err.response?.data?.message ||
            "Failed to create post. Please try again.",
        );
      }
    }
  };

  const handlePostLike = async (postId: string, isLiked: boolean) => {
    try {
      await likePost(postId, isLiked);

      // Update posts state to reflect the like action
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId || post.id === postId
            ? {
                ...post,
                upvotes: isLiked
                  ? (post.upvotes || 0) + 1
                  : (post.upvotes || 0) - 1,
                likeCount: isLiked
                  ? (post.likeCount || 0) + 1
                  : (post.likeCount || 0) - 1,
                isLikedByUser: isLiked,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handlePostSave = async (postId: string, isSaved: boolean) => {
    try {
      await savePost(postId, isSaved);

      // Update posts state to reflect the save action
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId || post.id === postId
            ? {
                ...post,
                isSavedByUser: isSaved,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  // Close error message after some time
  useEffect(() => {
    if (createPostError) {
      const timer = setTimeout(() => {
        setCreatePostError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [createPostError]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className={styles.postsContainer}>
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      )}

      {posts.length === 0 && !loading && !error ? (
        <div className={styles.emptyState}>
          <h3>No posts found</h3>
          <p>Be the first to share your thoughts with the community.</p>
          <Button onClick={() => setIsCreatePostModalOpen(true)}>
            Create a Post
          </Button>
        </div>
      ) : (
        <>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostElementRef} key={post.post_id || post.id}>
                  <Post
                    post={post}
                    onLike={handlePostLike}
                    onSave={handlePostSave}
                  />
                </div>
              );
            } else {
              return (
                <Post
                  key={post.post_id || post.id}
                  post={post}
                  onLike={handlePostLike}
                  onSave={handlePostSave}
                />
              );
            }
          })}
        </>
      )}

      {/* Loading indicators */}
      {loading && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}

      {loadingMore && !loading && (
        <div className={styles.loadMoreContainer}>
          <Loader />
          <p>Loading more posts...</p>
        </div>
      )}

      {/* Manual load more button as fallback */}
      {!loading && !loadingMore && hasMore && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={handleLoadMore} className={styles.loadMoreButton}>
            Load More Posts
          </Button>
        </div>
      )}

      {/* End of feed message */}
      {!loading && !loadingMore && !hasMore && posts.length > 0 && (
        <div className={styles.endOfFeed}>
          <p>You've reached the end of the feed</p>
          <Button onClick={handleRefresh} className={styles.refreshButton}>
            Refresh Feed
          </Button>
        </div>
      )}

      {/* Authentication Error Message */}
      {createPostError && (
        <div className={styles.createPostErrorBanner}>
          <p>{createPostError}</p>
          <Button onClick={() => triggerLogin()}>Log In</Button>
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        title="Share Your Thoughts"
        className={styles.createPostModal}
      >
        <PostCreationForm
          onSubmit={handleCreatePost}
          onClose={() => setIsCreatePostModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default FeedPage;
