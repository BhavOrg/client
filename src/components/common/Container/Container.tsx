import React from "react";
import styles from "./Container.module.scss";

interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
}

const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className = "",
  maxWidth = "lg",
}) => {
  return (
    <div
      className={`
        ${styles.container} 
        ${fluid ? styles.fluid : ""} 
        ${maxWidth !== "none" ? styles[maxWidth] : ""} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
