// src/components/common/Loader/Loader.tsx
import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent" | "neutral";
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "primary",
  text,
  className = "",
}) => {
  return (
    <div className={`${styles.loaderContainer} ${className}`}>
      <div className={`${styles.loader} ${styles[size]} ${styles[color]}`}>
        <div className={styles.spinner}></div>
      </div>
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
};

export default Loader;
