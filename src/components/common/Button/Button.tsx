import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  loadingText = "Loading...",
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        ${styles.button} 
        ${styles[`button--${variant}`]} 
        ${fullWidth ? styles["button--fullWidth"] : ""} 
        ${isLoading ? styles["button--loading"] : ""} 
        ${disabled ? styles["button--disabled"] : ""}
        ${icon ? styles["button--withIcon"] : ""}
        ${icon && iconPosition === "right" ? styles["button--iconRight"] : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className={styles.spinner}></span>
          {loadingText}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={styles.icon}>{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className={styles.icon}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
