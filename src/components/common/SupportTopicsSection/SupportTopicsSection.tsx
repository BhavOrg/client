import React from "react";
import styles from "./SupportTopicsSections.module.scss";
import Container from "../Container/Container";

interface TopicButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const TopicButton: React.FC<TopicButtonProps> = ({
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      className={`${styles.topicButton} ${active ? styles.topicButton__active : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const SupportTopicsSection: React.FC = () => {
  const topicsRow1 = [
    { label: "Anxiety", active: true },
    { label: "Depression", active: false },
    { label: "Stress", active: true },
  ];

  const topicsRow2 = [
    { label: "PTSD", active: true },
    { label: "ADHD", active: false },
    { label: "Sleep", active: false },
    { label: "Suicide", active: false },
  ];

  const topicsRow3 = [
    { label: "Addiction", active: false },
    { label: "Family", active: true },
    { label: "Break-up", active: true },
  ];

  return (
    <section className={styles.supportTopics}>
      <Container>
        <div className={styles.supportTopics__content}>
          <h2 className={styles.supportTopics__title}>
            Discover the Support You Deserve
          </h2>
          <p className={styles.supportTopics__subtitle}>
            Explore topics below to find the support and tools you need.
          </p>

          <div className={styles.supportTopics__grid}>
            <div className={styles.supportTopics__row}>
              {topicsRow1.map((topic, index) => (
                <TopicButton
                  key={`row1-${index}`}
                  label={topic.label}
                  active={topic.active}
                />
              ))}
            </div>

            <div className={styles.supportTopics__row}>
              {topicsRow2.map((topic, index) => (
                <TopicButton
                  key={`row2-${index}`}
                  label={topic.label}
                  active={topic.active}
                />
              ))}
            </div>

            <div className={styles.supportTopics__row}>
              {topicsRow3.map((topic, index) => (
                <TopicButton
                  key={`row3-${index}`}
                  label={topic.label}
                  active={topic.active}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SupportTopicsSection;
