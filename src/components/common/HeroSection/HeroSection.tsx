import React from "react";
import styles from "./HeroSection.module.scss";

const HeroSection: React.FC = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero__content}>
        <h1 className={styles.hero__title}>
          If you need someone to talk to,
          <br />
          you're at the right place
        </h1>
        <p className={styles.hero__subtitle}>
          Share feelings anonymously, be a part of interesting groups,
          <br />
          and connect with like-minded people
        </p>
        <div className={styles.hero__cta}>
          <button className={styles.hero__button}>
            Get Started <span className={styles.hero__button_arrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
