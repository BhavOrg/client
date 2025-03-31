import React from "react";
import { Link } from "react-router";
import styles from "./Footer.module.scss";
import Container from "../Container/Container";

// Import logo - adjust the path based on your project structure
import logo from "../../../assets/icons/bhav_logo.svg";

// Import social icons
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer navigation items
  const footerLinks = {
    platform: [
      { name: "Home", path: "/" },
      { name: "Feed", path: "/feed" },
      { name: "Community", path: "/community" },
      { name: "Find Experts", path: "/experts" },
      { name: "Resources", path: "/resources" },
    ],
    support: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Help Center", path: "/help" },
      { name: "Report an Issue", path: "/report" },
      { name: "Suggestion Box", path: "/suggestions" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Mission", path: "/mission" },
      { name: "Blog", path: "/blog" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
    ],
    legal: [
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Community Guidelines", path: "/guidelines" },
      { name: "Accessibility", path: "/accessibility" },
    ],
  };

  // Social media links
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      name: "Facebook",
      url: "https://facebook.com/bhavplatform",
    },
    {
      icon: <FaTwitter />,
      name: "Twitter",
      url: "https://twitter.com/bhavplatform",
    },
    {
      icon: <FaInstagram />,
      name: "Instagram",
      url: "https://instagram.com/bhavplatform",
    },
    {
      icon: <FaLinkedinIn />,
      name: "LinkedIn",
      url: "https://linkedin.com/company/bhavplatform",
    },
    {
      icon: <FaYoutube />,
      name: "YouTube",
      url: "https://youtube.com/c/bhavplatform",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <Container>
          <div className={styles.footer__grid}>
            <div className={styles.footer__brand}>
              <Link to="/" className={styles.footer__logoLink}>
                <img
                  src={logo}
                  alt="Bhav Logo"
                  className={styles.footer__logo}
                />
                <span className={styles.footer__logoText}>Bhav</span>
              </Link>
              <p className={styles.footer__tagline}>
                Your anonymous safe space for mental wellness and community
                support
              </p>
              <div className={styles.footer__social}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={styles.footer__socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.footer__links}>
              <div className={styles.footer__linkGroup}>
                <h3 className={styles.footer__linkTitle}>Platform</h3>
                <ul className={styles.footer__linkList}>
                  {footerLinks.platform.map((link, index) => (
                    <li key={index} className={styles.footer__linkItem}>
                      <Link to={link.path} className={styles.footer__link}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.footer__linkGroup}>
                <h3 className={styles.footer__linkTitle}>Support</h3>
                <ul className={styles.footer__linkList}>
                  {footerLinks.support.map((link, index) => (
                    <li key={index} className={styles.footer__linkItem}>
                      <Link to={link.path} className={styles.footer__link}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.footer__linkGroup}>
                <h3 className={styles.footer__linkTitle}>Company</h3>
                <ul className={styles.footer__linkList}>
                  {footerLinks.company.map((link, index) => (
                    <li key={index} className={styles.footer__linkItem}>
                      <Link to={link.path} className={styles.footer__link}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.footer__linkGroup}>
                <h3 className={styles.footer__linkTitle}>Legal</h3>
                <ul className={styles.footer__linkList}>
                  {footerLinks.legal.map((link, index) => (
                    <li key={index} className={styles.footer__linkItem}>
                      <Link to={link.path} className={styles.footer__link}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footer__newsletter}>
            <div className={styles.footer__newsletterContent}>
              <h3 className={styles.footer__newsletterTitle}>Stay Connected</h3>
              <p className={styles.footer__newsletterText}>
                Get updates on new resources, expert webinars, and community
                events.
              </p>
            </div>
            <form className={styles.footer__newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.footer__newsletterInput}
                aria-label="Email for newsletter"
                required
              />
              <button type="submit" className={styles.footer__newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </div>

      <div className={styles.footer__bottom}>
        <Container>
          <div className={styles.footer__bottomContent}>
            <p className={styles.footer__copyright}>
              © {currentYear} Bhav. All rights reserved.
            </p>
            <div className={styles.footer__bottomLinks}>
              <span className={styles.footer__madeWith}>
                Made with <span className={styles.footer__heart}>♥</span> for
                mental wellness
              </span>
              <span className={styles.footer__divider}>|</span>
              <a href="/sitemap" className={styles.footer__bottomLink}>
                Sitemap
              </a>
              <a href="/feedback" className={styles.footer__bottomLink}>
                Feedback
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Crisis support banner */}
      <div className={styles.footer__crisis}>
        <Container>
          <div className={styles.footer__crisisContent}>
            <p className={styles.footer__crisisText}>
              <strong>Need immediate help?</strong> If you're in crisis, please
              call the National Suicide Prevention Lifeline at{" "}
              <a href="tel:988" className={styles.footer__crisisLink}>
                988
              </a>{" "}
              or text HOME to{" "}
              <a href="sms:741741" className={styles.footer__crisisLink}>
                741741
              </a>{" "}
              to reach a crisis counselor.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
