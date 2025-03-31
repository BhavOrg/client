import React from "react";
import styles from "./QuoteSection.module.scss";
import Container from "../Container/Container";

import dan_img from "../../../assets/images/dan.jpg";

interface QuoteSectionProps {
  quote: string;
  author: string;
  imageSrc: string;
  authorTitle?: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({
  quote = "You don't have to control your thoughts. You just have to stop letting them control you.",
  author = "Dan Millman",
  authorTitle = "Author, Way of the Peaceful Warrior",
}) => {
  return (
    <section className={styles.quoteSection}>
      <Container>
        <div className={styles.quoteSection__wrapper}>
          <div className={styles.quoteSection__content}>
            <div className={styles.quoteSection__quoteWrapper}>
              <div className={styles.quoteSection__quoteIcon}>"</div>
              <blockquote className={styles.quoteSection__quote}>
                {quote}
              </blockquote>
              <div className={styles.quoteSection__author}>
                <span className={styles.quoteSection__authorName}>
                  —{author}
                </span>
                {authorTitle && (
                  <span className={styles.quoteSection__authorTitle}>
                    {authorTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.quoteSection__imageWrapper}>
            <div className={styles.quoteSection__imageContainer}>
              <img
                src={dan_img}
                alt={author}
                className={styles.quoteSection__image}
              />
              <div className={styles.quoteSection__imageRing}></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default QuoteSection;
