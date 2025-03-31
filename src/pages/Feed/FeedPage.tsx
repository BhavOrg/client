import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Container from "../../components/common/Container/Container";
import PostCreationForm from "../../components/features/Feed/PostCreationForm/PostCreationForm";
import Post from "../../components/features/Feed/Post/Post";
import FeedFilters from "../../components/features/Feed/FeedFilters/FeedFilters";
import Loader from "../../components/common/Loader/Loader";
import Modal from "../../components/common/Modal/Modal";
import Button from "../../components/common/Button/Button";
import useAuth from "../../hooks/useAuth";
import { fetchPosts, createPost, likePost } from "../../services/PostsService";
import {
  Tag,
  Post as PostType,
  SortOption,
  FilterOption,
} from "../../types/feed";
import styles from "./FeedPage.module.scss";

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch posts on component mount and when dependencies change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchFeedData = async () => {
      try {
        // Use filter values from parent layout via props or context if needed
        const response = await fetchPosts({ page });

        if (page === 1) {
          setPosts(response.data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
        }

        setHasMore(response.data.length > 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeedData();
  }, [page, refreshTrigger]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  const handleRefresh = () => {
    setPage(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreatePost = async (postData: any) => {
    try {
      await createPost(postData);
      setIsCreatePostModalOpen(false);
      handleRefresh();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handlePostLike = async (postId: string, isLiked: boolean) => {
    try {
      await likePost(postId, isLiked);

      // Update posts state to reflect the like action
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1,
                isLikedByUser: isLiked,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  return (
    <Container>
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
                  <div ref={lastPostElementRef} key={post.id}>
                    <Post post={post} onLike={handlePostLike} />
                  </div>
                );
              } else {
                return (
                  <Post key={post.id} post={post} onLike={handlePostLike} />
                );
              }
            })}
          </>
        )}

        {loading && (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}

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
    </Container>
  );
};

export default FeedPage;
