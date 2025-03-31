import React from "react";
import styles from "./ExpertsSection.module.scss";
import Container from "../Container/Container";

import annaImage from "../../../assets/images/dan.jpg";
import laylaImage from "../../../assets/images/dan.jpg";
import davidImage from "../../../assets/images/dan.jpg";

const ExpertsSection: React.FC = () => {
  // Static experts data
  const experts = [
    {
      id: "expert1",
      name: "Anna Devon",
      title: "Organizational Psychologist",
      quote:
        "Mental health platforms that prioritize anonymity see 68% higher engagement rates. Bhav's approach creates a safe space that encourages honest expression.",
      image: annaImage,
      color: "#FF6E42", // primary color
    },
    {
      id: "expert2",
      name: "Layla Blake",
      title: "Mental Health Counselor, Founder",
      quote:
        "What sets Bhav apart is its unique blend of community support and professional guidance. The AI-powered intervention system ensures users receive timely expert help.",
      image: laylaImage,
      color: "#6E57B5", // secondary color
    },
    {
      id: "expert3",
      name: "Layla Blake",
      title: "Mental Health Counselor, Founder",
      quote:
        "What sets Bhav apart is its unique blend of community support and professional guidance. The AI-powered intervention system ensures users receive timely expert help.",
      image: laylaImage,
      color: "#8E57C5", // secondary color
    },
    {
      id: "expert4",
      name: "David Chou",
      title: "Mental Health Counselor",
      quote:
        "In my 15 years of practice, I've seen how fear of judgment prevents many from seeking help. Bhav's anonymity-first approach removes these barriers.",
      image: davidImage,
      color: "#4BB58E", // accent color
    },
  ];

  return (
    <section className={styles.experts}>
      <Container>
        <div className={styles.experts__header}>
          <h2 className={styles.experts__Maintitle}>
            Here is what{" "}
            <span className={styles.experts__titleAccent}>experts say</span>
          </h2>
        </div>

        <div className={styles.experts__grid}>
          {experts.map((expert, index) => (
            <div
              key={expert.id}
              className={styles.experts__card}
              style={
                {
                  "--card-color": expert.color,
                  "--card-delay": `${index * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <div className={styles.experts__meta}>
                <div className={styles.experts__imageWrapper}>
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className={styles.experts__image}
                  />
                </div>
                <div className={styles.experts__author}>
                  <h3 className={styles.experts__name}>{expert.name}</h3>
                  <p className={styles.experts__title}>{expert.title}</p>
                </div>
              </div>

              <div className={styles.experts__quoteWrapper}>
                <p className={styles.experts__quote}>"{expert.quote}"</p>
                <div className={styles.experts__quoteSymbol}></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ExpertsSection;
