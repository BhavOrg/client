import React from "react";
import Navbar from "../Navbar/Navbar";
import HeroSection from "../HeroSection/HeroSection";
import styles from "./Header.module.scss";

interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header__background}>
        <div className={styles.header__shape_left}></div>
        <div className={styles.header__shape_right}></div>
      </div>
      <div className={styles.header__content}>
        <Navbar isLoggedIn={isLoggedIn} />
        <HeroSection />
      </div>
    </header>
  );
};

export default Header;
