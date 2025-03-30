import React from "react";
import styles from "./MissionSection.module.scss";
import Container from "../Container/Container";

const MissionSection: React.FC = () => {
  return (
    <section className={styles.mission}>
      <Container>
        <div className={styles.mission__header}>
          <span className={styles.mission__tag}>Why Choose Bhav</span>
          <h2 className={styles.mission__title}>Our approach is different</h2>
        </div>

        <div className={styles.mission__grid}>
          <div className={styles.mission__item}>
            <div className={styles.mission__number}>01</div>
            <h3 className={styles.mission__itemTitle}>Complete Anonymity</h3>
            <p className={styles.mission__itemText}>
              Speak freely without revealing your identity. Your privacy is our
              foundation.
            </p>
          </div>

          <div className={styles.mission__item}>
            <div className={styles.mission__number}>02</div>
            <h3 className={styles.mission__itemTitle}>Community-Driven</h3>
            <p className={styles.mission__itemText}>
              Connect with others who understand. Healing happens together.
            </p>
          </div>

          <div className={styles.mission__item}>
            <div className={styles.mission__number}>03</div>
            <h3 className={styles.mission__itemTitle}>AI-Enhanced Support</h3>
            <p className={styles.mission__itemText}>
              Smart technology that connects you with the right support at the
              right time.
            </p>
          </div>
        </div>

        <div className={styles.mission__stats}>
          <div className={styles.mission__stat}>
            <span className={styles.mission__statValue}>100%</span>
            <span className={styles.mission__statLabel}>Anonymous</span>
          </div>
          <div className={styles.mission__divider}></div>
          <div className={styles.mission__stat}>
            <span className={styles.mission__statValue}>24/7</span>
            <span className={styles.mission__statLabel}>Support</span>
          </div>
          <div className={styles.mission__divider}></div>
          <div className={styles.mission__stat}>
            <span className={styles.mission__statValue}>0</span>
            <span className={styles.mission__statLabel}>
              Personal Data Collected
            </span>
          </div>
        </div>

        <div className={styles.mission__quote}>
          <p>
            "Mental health support with privacy by design, not as an
            afterthought."
          </p>
        </div>
      </Container>
    </section>
  );
};

export default MissionSection;
