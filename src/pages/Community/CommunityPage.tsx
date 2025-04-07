import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import styles from "./CommunityPage.module.scss";
import {
  FaSearch,
  FaFilter,
  FaUsers,
  FaComments,
  FaBookmark,
} from "react-icons/fa";

// Mock data for communities
const communities = [
  {
    id: 1,
    name: "Anxiety Support",
    description: "A safe space to discuss anxiety and share coping techniques.",
    members: 1243,
    activity: "Very Active",
    posts: 347,
    tags: ["Anxiety", "Stress", "Coping", "Support"],
    imagePath: "community1",
  },
  {
    id: 2,
    name: "Mindfulness Practice",
    description:
      "Daily mindfulness exercises and discussions for mental well-being.",
    members: 986,
    activity: "Active",
    posts: 215,
    tags: ["Meditation", "Mindfulness", "Present", "Awareness"],
    imagePath: "community2",
  },
  {
    id: 3,
    name: "Depression Support",
    description:
      "Supporting each other through depression with understanding and empathy.",
    members: 1752,
    activity: "Very Active",
    posts: 412,
    tags: ["Depression", "Support", "Mental Health", "Recovery"],
    imagePath: "community3",
  },
  {
    id: 4,
    name: "Work-Life Balance",
    description:
      "Strategies for managing career demands while maintaining mental health.",
    members: 834,
    activity: "Moderately Active",
    posts: 178,
    tags: ["Work", "Balance", "Stress", "Career"],
    imagePath: "community4",
  },
  {
    id: 5,
    name: "Relationship Wellness",
    description: "Building healthy relationships and setting boundaries.",
    members: 1105,
    activity: "Active",
    posts: 263,
    tags: ["Relationships", "Boundaries", "Communication", "Health"],
    imagePath: "community5",
  },
  {
    id: 6,
    name: "PTSD Support Group",
    description:
      "A supportive environment for those dealing with trauma and PTSD.",
    members: 687,
    activity: "Active",
    posts: 193,
    tags: ["PTSD", "Trauma", "Recovery", "Support"],
    imagePath: "community6",
  },
  {
    id: 7,
    name: "Self-Care Practices",
    description:
      "Sharing effective self-care routines and habits for mental health.",
    members: 1428,
    activity: "Very Active",
    posts: 321,
    tags: ["Self-Care", "Wellness", "Habits", "Health"],
    imagePath: "community7",
  },
  {
    id: 8,
    name: "Sleep & Mental Health",
    description:
      "Understanding the connection between sleep quality and mental wellness.",
    members: 763,
    activity: "Moderately Active",
    posts: 145,
    tags: ["Sleep", "Rest", "Mental Health", "Wellness"],
    imagePath: "community8",
  },
];

// Filter categories
const categories = [
  "All",
  "Anxiety",
  "Depression",
  "Mindfulness",
  "Self-Care",
  "Relationships",
  "Trauma",
  "Work-Life",
];

// Activity levels for filtering
const activityLevels = [
  "Any Activity",
  "Very Active",
  "Active",
  "Moderately Active",
];

const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("Any Activity");
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter communities based on selected filters and search term
  useEffect(() => {
    let results = communities;

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((community) =>
        community.tags.some((tag) =>
          tag.toLowerCase().includes(selectedCategory.toLowerCase()),
        ),
      );
    }

    // Filter by activity level
    if (selectedActivity !== "Any Activity") {
      results = results.filter(
        (community) => community.activity === selectedActivity,
      );
    }

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (community) =>
          community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          community.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          community.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredCommunities(results);
  }, [selectedCategory, searchTerm, selectedActivity]);

  return (
    <div className={styles.communityPageWrapper}>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      <main className={styles.communityMain}>
        <div className={styles.communityHeader}>
          <Container>
            <div className={styles.headerContent}>
              <h1>Communities</h1>
              <p>Connect with others in a safe, anonymous environment</p>
            </div>
          </Container>
        </div>

        <Container>
          <div className={styles.communityToolbar}>
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterToggle}>
              <button
                className={styles.filterButton}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div
            className={`${styles.filtersPanel} ${isFilterOpen ? styles.open : ""}`}
          >
            <div className={styles.filterSection}>
              <h3>Categories</h3>
              <div className={styles.filterOptions}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.filterOption} ${selectedCategory === category ? styles.active : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3>Activity Level</h3>
              <div className={styles.filterOptions}>
                {activityLevels.map((level) => (
                  <button
                    key={level}
                    className={`${styles.filterOption} ${selectedActivity === level ? styles.active : ""}`}
                    onClick={() => setSelectedActivity(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredCommunities.length > 0 ? (
            <div className={styles.communitiesGrid}>
              {filteredCommunities.map((community) => (
                <div key={community.id} className={styles.communityCard}>
                  <div
                    className={styles.communityImage}
                    style={{
                      backgroundImage: `url(/src/assets/images/${community.imagePath}.avif)`,
                    }}
                  >
                    <div className={styles.communityMeta}>
                      <span className={styles.activityBadge}>
                        {community.activity}
                      </span>
                    </div>
                    <h2 className={styles.imageTitle}>{community.name}</h2>
                  </div>

                  <div className={styles.communityContent}>
                    <h2 className={styles.mobileTitleOnly}>{community.name}</h2>
                    <p className={styles.description}>
                      {community.description}
                    </p>

                    <div className={styles.communityStats}>
                      <div className={styles.statItem}>
                        <FaUsers />
                        <span>
                          {community.members.toLocaleString()} members
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <FaComments />
                        <span>{community.posts} posts this week</span>
                      </div>
                    </div>

                    <div className={styles.communityTags}>
                      {community.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.cardActions}>
                      <Button className={styles.joinButton}>Join</Button>
                      <button className={styles.saveButton}>
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h2>No communities found</h2>
              <p>Try adjusting your search criteria or explore other topics</p>
              <Button
                className={styles.resetButton}
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedActivity("Any Activity");
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          <div className={styles.createCommunityWrapper}>
            <div className={styles.createCommunityContent}>
              <h2>Can't find what you're looking for?</h2>
              <p>
                Create your own community and connect with people who share your
                interests
              </p>
              <Button className={styles.createButton}>Create Community</Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;
