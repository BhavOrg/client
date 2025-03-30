import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import {
  FaHome,
  FaNewspaper,
  FaUsers,
  FaBlog,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import styles from "./Navbar.module.scss";
import Container from "../Container/Container";
import navConfig from "./navConfig";

// NavbarProps interface
interface NavbarProps {
  isLoggedIn?: boolean;
}

// Helper function to render icon based on menu item name
const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "home":
      return <FaHome />;
    case "feed":
      return <FaNewspaper />;
    case "community":
      return <FaUsers />;
    case "blogs":
      return <FaBlog />;
    case "contact":
      return <FaEnvelope />;
    case "profile":
      return <FaUserCircle />;
    case "logout":
      return <FaSignOutAlt />;
    case "login":
      return <FaSignInAlt />;
    case "register":
      return <FaUserPlus />;
    default:
      return null;
  }
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);

      // Close menu if transitioning from mobile to desktop
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setActiveSubMenu(null);
        if (isMobile) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  // Handle dropdown toggle
  const handleDropdownToggle = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
      setActiveSubMenu(null);
    } else {
      setActiveDropdown(index);
      setActiveSubMenu(null);
    }
  };

  // Handle submenu toggle
  const handleSubmenuToggle = (name: string) => {
    if (activeSubMenu === name) {
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(name);
    }
  };

  return (
    <div className={styles.navbarWrapper}>
      <Container>
        <nav className={styles.navbar} ref={navRef}>
          {/* Mobile menu toggle button */}
          <button
            className={styles.navbar__toggle}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>

          {/* Logo Section */}
          <div className={styles.navbar__logo}>
            <Link to={navConfig.logo.link}>
              <img
                src={navConfig.logo.src}
                alt={navConfig.logo.alt}
                className={styles["navbar__logo-img"]}
              />
            </Link>
          </div>

          {/* Navigation Menu Section */}
          <div
            className={`${styles.navbar__menu} ${isMenuOpen ? styles.open : ""}`}
          >
            <ul className={styles.navbar__menuItems}>
              {navConfig.menu.map((item, index) => (
                <li
                  key={item.name}
                  className={`${styles.navbar__item} ${activeDropdown === index ? styles.active : ""}`}
                >
                  {item.link ? (
                    <Link
                      to={item.link}
                      className={`${styles.navbar__link} ${location.pathname === item.link ? styles.active : ""}`}
                      onClick={() => isMobile && setIsMenuOpen(false)}
                    >
                      <span className={styles.navbar__icon}>
                        {getIcon(item.name)}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      className={styles.navbar__button}
                      onClick={() => handleDropdownToggle(index)}
                    >
                      <span>{item.name}</span>
                      <FaChevronDown
                        className={`${styles.navbar__chevron} ${activeDropdown === index ? styles.rotated : ""}`}
                      />
                    </button>
                  )}

                  {/* Dropdown for items with dropdown property */}
                  {item.dropdown && activeDropdown === index && (
                    <div className={styles.navbar__dropdown}>
                      {item.dropdown.map((category) => (
                        <div
                          key={category.name}
                          className={styles.navbar__category}
                        >
                          <button
                            className={`${styles.navbar__categoryTitle} ${activeSubMenu === category.name ? styles.active : ""}`}
                            onClick={() => handleSubmenuToggle(category.name)}
                          >
                            {category.name}
                            <FaChevronDown
                              className={`${styles.navbar__chevron} ${activeSubMenu === category.name ? styles.rotated : ""}`}
                            />
                          </button>

                          {category.subDropdown &&
                            activeSubMenu === category.name && (
                              <ul className={styles.navbar__submenu}>
                                {category.subDropdown.map((subItem) => (
                                  <li
                                    key={subItem.name}
                                    className={styles.navbar__submenuItem}
                                  >
                                    <Link
                                      to={subItem.link}
                                      className={styles.navbar__submenuLink}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setActiveSubMenu(null);
                                        isMobile && setIsMenuOpen(false);
                                      }}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Section */}
          <div className={styles.navbar__auth}>
            {isLoggedIn ? (
              <>
                {navConfig.authActions.loggedIn.map((action) => (
                  <React.Fragment key={action.name}>
                    {action.link ? (
                      <Link
                        to={action.link}
                        className={`${styles.navbar__authLink} ${
                          action.name.toLowerCase() === "profile"
                            ? styles.navbar__profile
                            : styles.navbar__action
                        }`}
                        onClick={() => isMobile && setIsMenuOpen(false)}
                      >
                        <span className={styles.navbar__icon}>
                          {getIcon(action.name)}
                        </span>
                        <span>{action.name}</span>
                      </Link>
                    ) : (
                      <button
                        className={`${styles.navbar__authBtn} ${styles.navbar__logout}`}
                      >
                        <span className={styles.navbar__icon}>
                          {getIcon(action.name)}
                        </span>
                        <span>{action.name}</span>
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                {navConfig.authActions.loggedOut.map((action, index) => (
                  <Link
                    key={action.name}
                    to={action.link || "#"}
                    className={`${styles.navbar__authLink} ${
                      index === 0
                        ? styles.navbar__login
                        : styles.navbar__register
                    }`}
                    onClick={() => isMobile && setIsMenuOpen(false)}
                  >
                    <span className={styles.navbar__icon}>
                      {getIcon(action.name)}
                    </span>
                    <span>{action.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
