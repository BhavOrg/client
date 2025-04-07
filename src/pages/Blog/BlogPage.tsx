import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import styles from "./BlogPage.module.scss";
import {
  FaSearch,
  FaClock,
  FaUser,
  FaBookmark,
  FaShareAlt,
  FaTags,
} from "react-icons/fa";

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "Understanding Anxiety: Symptoms, Causes, and Coping Strategies",
    excerpt:
      "Anxiety is more than just feeling stressed. Learn about the biological and environmental factors that contribute to anxiety disorders and discover effective strategies for managing symptoms.",
    author: "Dr. Sarah Chen",
    authorTitle: "Clinical Psychologist",
    date: "April 2, 2025",
    readTime: "8 min read",
    category: "Mental Health",
    tags: ["Anxiety", "Mental Health", "Coping Strategies", "Self-Care"],
    imagePath: "community1",
    featured: true,
  },
  {
    id: 2,
    title: "The Science of Mindfulness Meditation",
    excerpt:
      "Recent research has shown significant benefits of regular mindfulness practice on brain function and stress reduction. Explore the science behind this ancient practice.",
    author: "Dr. Michael Rivera",
    authorTitle: "Neuroscientist",
    date: "March 28, 2025",
    readTime: "6 min read",
    category: "Mindfulness",
    tags: ["Mindfulness", "Meditation", "Brain Health", "Research"],
    imagePath: "community2",
  },
  {
    id: 3,
    title: "Supporting a Loved One with Depression",
    excerpt:
      "It can be challenging to know how to help someone with depression. Learn practical ways to provide support while also maintaining your own well-being.",
    author: "Emma Thompson",
    authorTitle: "Mental Health Advocate",
    date: "March 24, 2025",
    readTime: "7 min read",
    category: "Depression",
    tags: ["Depression", "Support", "Relationships", "Communication"],
    imagePath: "community3",
  },
  {
    id: 4,
    title: "Creating Work-Life Balance in a Digital Age",
    excerpt:
      "The boundaries between work and personal life have become increasingly blurred. Discover strategies for establishing healthy boundaries in today's always-connected world.",
    author: "Alex Morgan",
    authorTitle: "Occupational Therapist",
    date: "March 19, 2025",
    readTime: "5 min read",
    category: "Work-Life Balance",
    tags: ["Work-Life Balance", "Digital Wellbeing", "Boundaries", "Self-Care"],
    imagePath: "community4",
  },
  {
    id: 5,
    title: "The Connection Between Physical and Mental Health",
    excerpt:
      "Our bodies and minds are deeply interconnected. Explore how physical activity, nutrition, and sleep quality impact mental well-being.",
    author: "Dr. James Wilson",
    authorTitle: "Health Psychologist",
    date: "March 15, 2025",
    readTime: "9 min read",
    category: "Wellness",
    tags: ["Physical Health", "Exercise", "Nutrition", "Mental Health"],
    imagePath: "community5",
  },
  {
    id: 6,
    title: "Healing from Trauma: The Path Forward",
    excerpt:
      "Trauma leaves lasting impacts, but recovery is possible. Learn about evidence-based approaches for healing and post-traumatic growth.",
    author: "Dr. Leila Patel",
    authorTitle: "Trauma Specialist",
    date: "March 10, 2025",
    readTime: "10 min read",
    category: "Trauma",
    tags: ["Trauma", "PTSD", "Recovery", "Healing"],
    imagePath: "community6",
  },
  {
    id: 7,
    title: "Self-Compassion: Being Kinder to Yourself",
    excerpt:
      "Many of us are our own harshest critics. Discover how practicing self-compassion can improve your mental health and enhance resilience.",
    author: "Nina Rodriguez",
    authorTitle: "Counseling Psychologist",
    date: "March 5, 2025",
    readTime: "7 min read",
    category: "Self-Care",
    tags: [
      "Self-Compassion",
      "Self-Care",
      "Emotional Wellbeing",
      "Mental Health",
    ],
    imagePath: "community7",
  },
  {
    id: 8,
    title: "The Role of Sleep in Mental Health",
    excerpt:
      "Sleep and mental health have a bidirectional relationship. Explore how improving sleep quality can enhance mood, cognition, and overall mental well-being.",
    author: "Dr. Thomas Lee",
    authorTitle: "Sleep Researcher",
    date: "February 28, 2025",
    readTime: "6 min read",
    category: "Sleep",
    tags: ["Sleep", "Mental Health", "Insomnia", "Wellbeing"],
    imagePath: "community8",
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Mental Health",
  "Mindfulness",
  "Depression",
  "Work-Life Balance",
  "Wellness",
  "Trauma",
  "Self-Care",
  "Sleep",
];

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // Featured post is the first one with featured: true
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];

  // Filter posts based on category and search term
  useEffect(() => {
    let results = blogPosts;

    // First filter by category (except featured post)
    if (activeCategory !== "All Categories") {
      results = results.filter(
        (post) =>
          post.category === activeCategory ||
          post.tags.includes(activeCategory),
      );
    }

    // Then filter by search term
    if (searchTerm) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredPosts(results);
  }, [activeCategory, searchTerm]);

  return (
    <div className={styles.blogPageWrapper}>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      <main className={styles.blogMain}>
        {/* Blog Header */}
        <section className={styles.blogHeader}>
          <Container>
            <div className={styles.headerContent}>
              <h1>Bhav Blog</h1>
              <p>Insights, stories, and expert advice for mental wellbeing</p>
            </div>
          </Container>
        </section>

        <Container>
          {/* Search and Categories */}
          <div className={styles.blogTools}>
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.categoriesWrapper}>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ""}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <section className={styles.featuredPost}>
              <div
                className={styles.featuredImage}
                style={{
                  backgroundImage: `url(/src/assets/images/${featuredPost.imagePath}.avif)`,
                }}
              >
                <span className={styles.featuredLabel}>Featured</span>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.postMeta}>
                  <span className={styles.category}>
                    {featuredPost.category}
                  </span>
                  <span className={styles.readTime}>
                    <FaClock /> {featuredPost.readTime}
                  </span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p className={styles.excerpt}>{featuredPost.excerpt}</p>
                <div className={styles.authorInfo}>
                  <div className={styles.authorAvatar}>
                    {featuredPost.author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <div className={styles.authorDetails}>
                    <span className={styles.authorName}>
                      {featuredPost.author}
                    </span>
                    <span className={styles.authorTitle}>
                      {featuredPost.authorTitle}
                    </span>
                  </div>
                  <span className={styles.date}>{featuredPost.date}</span>
                </div>
                <div className={styles.postActions}>
                  <Button className={styles.readMoreButton}>
                    Read Article
                  </Button>
                  <button className={styles.actionButton}>
                    <FaBookmark />
                  </button>
                  <button className={styles.actionButton}>
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <article key={post.id} className={styles.postCard}>
                  <div
                    className={styles.postImage}
                    style={{
                      backgroundImage: `url(/src/assets/images/${post.imagePath}.avif)`,
                    }}
                  >
                    <div className={styles.postImageOverlay}>
                      <Button className={styles.smallReadButton}>Read</Button>
                    </div>
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.category}>{post.category}</span>
                      <span className={styles.readTime}>
                        <FaClock /> {post.readTime}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <div className={styles.postFooter}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                          {post.author
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                        <span className={styles.authorName}>{post.author}</span>
                      </div>
                      <div className={styles.postActions}>
                        <button className={styles.actionButton}>
                          <FaBookmark />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h2>No articles found</h2>
              <p>Try adjusting your search criteria or browse all categories</p>
              <Button
                className={styles.resetButton}
                onClick={() => {
                  setActiveCategory("All Categories");
                  setSearchTerm("");
                }}
              >
                View All Articles
              </Button>
            </div>
          )}

          {/* Newsletter Section */}
          <section className={styles.newsletterSection}>
            <div className={styles.newsletterCard}>
              <div className={styles.newsletterContent}>
                <h2>Stay Updated with Mental Health Insights</h2>
                <p>
                  Subscribe to our newsletter for the latest articles,
                  resources, and expert advice
                </p>
                <div className={styles.subscribeForm}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className={styles.emailInput}
                  />
                  <Button className={styles.subscribeButton}>Subscribe</Button>
                </div>
                <p className={styles.privacyNote}>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
