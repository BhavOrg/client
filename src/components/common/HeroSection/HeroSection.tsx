import React from "react";
import styles from "./HeroSection.module.scss";

const HeroSection: React.FC = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero__content}>
        <h1 className={styles.hero__title}>
          Heal in community,
          <br />
          stay in anonymity
        </h1>
        <p className={styles.hero__subtitle}>
          A safe space where your thoughts can breathe freely, your struggles
          find understanding, and professional guidance meets you where you
          are—without ever compromising your privacy.
        </p>
        <div className={styles.hero__cta}>
          <button className={styles.hero__button}>
            Begin Your Journey{" "}
            <span className={styles.hero__button_arrow}>→</span>
          </button>
        </div>
        <div className={styles.hero__features}>
          <div className={styles.hero__feature}>
            <span className={styles.hero__feature_icon}>🔒</span>
            <span className={styles.hero__feature_text}>
              Complete Anonymity
            </span>
          </div>
          <div className={styles.hero__feature}>
            <span className={styles.hero__feature_icon}>👥</span>
            <span className={styles.hero__feature_text}>Community Support</span>
          </div>
          <div className={styles.hero__feature}>
            <span className={styles.hero__feature_icon}>👨‍⚕️</span>
            <span className={styles.hero__feature_text}>Expert Guidance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
