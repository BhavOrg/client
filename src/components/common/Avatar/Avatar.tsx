import React from "react";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  username: string;
  imageSrc?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  username,
  imageSrc,
  size = "medium",
  className = "",
}) => {
  // Generate initials for the avatar if no image is provided
  const generateInitials = () => {
    if (!username || username === "Anonymous") return "A";

    const nameParts = username.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }

    return username.substring(0, 2).toUpperCase();
  };

  // Generate a consistent background color based on username
  const generateColor = () => {
    if (username === "Anonymous") return "#A0AEC0"; // neutral color for anonymous

    const colors = [
      "#F56565", // red
      "#ED8936", // orange
      "#ECC94B", // yellow
      "#48BB78", // green
      "#4299E1", // blue
      "#667EEA", // indigo
      "#9F7AEA", // purple
      "#ED64A6", // pink
    ];

    // Simple hash function to generate a consistent index
    const hash = username.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${className}`}
      title={username}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${username}'s avatar`}
          className={styles.image}
        />
      ) : (
        <div
          className={styles.initials}
          style={{ backgroundColor: generateColor() }}
        >
          {generateInitials()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
