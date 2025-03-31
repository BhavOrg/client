import React, { useState } from "react";
import styles from "./ExpertCategoriesSection.module.scss";
import Container from "../Container/Container";
import { motion } from "framer-motion";
interface ExpertCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // This would be an emoji or icon component in production
  count: number;
}

const ExpertCategoriesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("relationship");

  const categories: ExpertCategory[] = [
    {
      id: "relationship",
      name: "Relationship Coach",
      description:
        "Navigate complexities in relationships with expert guidance",
      icon: "❤️",
      count: 24,
    },
    {
      id: "counselling",
      name: "Counselling Psychologist",
      description: "Professional support through cognitive behavioral therapy",
      icon: "🧠",
      count: 18,
    },
    {
      id: "life",
      name: "Life Coach",
      description: "Guidance to achieve personal and professional goals",
      icon: "✨",
      count: 15,
    },
    {
      id: "therapist",
      name: "Therapist",
      description: "Specialized care for emotional and mental well-being",
      icon: "🌱",
      count: 20,
    },
    {
      id: "clinical",
      name: "Clinical Psychologist",
      description: "Expert care for complex mental health challenges",
      icon: "🔬",
      count: 12,
    },
    {
      id: "positivity",
      name: "Positivity Coach",
      description: "Transform your mindset toward optimism and growth",
      icon: "☀️",
      count: 8,
    },
    {
      id: "career",
      name: "Career Coach",
      description: "Navigate career transitions and professional development",
      icon: "💼",
      count: 10,
    },
    {
      id: "sexual",
      name: "Sexual Wellness Coach",
      description: "Guidance for intimate health and relationships",
      icon: "💖",
      count: 7,
    },
    {
      id: "mindset",
      name: "Mindset Transformation Coach",
      description: "Overcome limiting beliefs and develop resilience",
      icon: "🔄",
      count: 9,
    },
  ];

  return (
    <section className={styles.expertCategories}>
      <div className={styles.expertCategories__background}>
        <div className={styles.expertCategories__gradientLeft}></div>
        <div className={styles.expertCategories__gradientRight}></div>
      </div>

      <Container>
        <div className={styles.expertCategories__content}>
          <div className={styles.expertCategories__header}>
            <motion.h2
              className={styles.expertCategories__title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Expert Guidance to Help You Thrive,
              <br />
              <span className={styles.expertCategories__titleHighlight}>
                Inside and Out the Support You Deserve
              </span>
            </motion.h2>

            <motion.p
              className={styles.expertCategories__subtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              "Connect with specialized professionals who understand your unique
              needs"
            </motion.p>
          </div>

          <div className={styles.expertCategories__mainContent}>
            <div className={styles.expertCategories__featured}>
              {categories
                .filter((category) => category.id === selectedCategory)
                .map((category) => (
                  <motion.div
                    key={category.id}
                    className={styles.expertCategories__featuredCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.expertCategories__featuredIcon}>
                      <span>{category.icon}</span>
                    </div>
                    <h3 className={styles.expertCategories__featuredTitle}>
                      {category.name}
                    </h3>
                    <p className={styles.expertCategories__featuredDescription}>
                      {category.description}
                    </p>
                    <div className={styles.expertCategories__featuredMeta}>
                      <span className={styles.expertCategories__featuredCount}>
                        {category.count} Experts Available
                      </span>
                      <button
                        className={styles.expertCategories__featuredButton}
                      >
                        Find Expert
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>

            <div className={styles.expertCategories__selector}>
              <div className={styles.expertCategories__selectorHeader}>
                <h3 className={styles.expertCategories__selectorTitle}>
                  Explore Expert Types
                </h3>
              </div>
              <div className={styles.expertCategories__grid}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.expertCategories__categoryButton} ${
                      selectedCategory === category.id
                        ? styles.expertCategories__categoryButton_active
                        : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className={styles.expertCategories__categoryIcon}>
                      {category.icon}
                    </span>
                    <span className={styles.expertCategories__categoryName}>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.expertCategories__cta}>
            <a href="/all-experts" className={styles.expertCategories__link}>
              View All Expert Categories
              <svg
                className={styles.expertCategories__linkIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L15 8L8 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 8H1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExpertCategoriesSection;
