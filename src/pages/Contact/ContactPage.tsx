import React, { useState } from "react";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import styles from "./ContactPage.module.scss";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaComment,
  FaUserAlt,
  FaQuestionCircle,
  FaCheckCircle,
} from "react-icons/fa";

// Contact categories
const contactReasons = [
  {
    id: "general",
    title: "General Inquiry",
    icon: <FaQuestionCircle />,
    description:
      "Questions about Bhav platform, features, or general information",
  },
  {
    id: "support",
    title: "Technical Support",
    icon: <FaComment />,
    description:
      "Help with account issues, app functionality, or technical problems",
  },
  {
    id: "expert",
    title: "Expert Verification",
    icon: <FaUserAlt />,
    description:
      "Professionals looking to join our platform as verified experts",
  },
  {
    id: "feedback",
    title: "Feedback",
    icon: <FaCheckCircle />,
    description: "Share your thoughts, suggestions, or experiences with Bhav",
  },
];

const ContactPage: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState<string>("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className={styles.contactPageWrapper}>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      <main className={styles.contactMain}>
        {/* Contact Header */}
        <section className={styles.contactHeader}>
          <Container>
            <div className={styles.headerContent}>
              <h1>Contact Us</h1>
              <p>
                Have questions, feedback, or need assistance? We're here to
                help.
              </p>
            </div>
          </Container>
        </section>

        <Container>
          <div className={styles.contactContainer}>
            {/* Contact Information */}
            <div className={styles.contactInfoSection}>
              <div className={styles.infoCard}>
                <h2>Get in Touch</h2>
                <p>
                  Our team is available to assist you with any questions or
                  concerns.
                </p>

                <div className={styles.contactDetails}>
                  <div className={styles.contactMethod}>
                    <div className={styles.iconWrapper}>
                      <FaEnvelope />
                    </div>
                    <div className={styles.contactText}>
                      <h3>Email Us</h3>
                      <p>support@bhavhealth.com</p>
                      <p>Typical response time: 24-48 hours</p>
                    </div>
                  </div>

                  <div className={styles.contactMethod}>
                    <div className={styles.iconWrapper}>
                      <FaPhone />
                    </div>
                    <div className={styles.contactText}>
                      <h3>Call Us</h3>
                      <p>+1 (555) 123-4567</p>
                      <p>Mon-Fri: 9AM - 5PM EST</p>
                    </div>
                  </div>

                  <div className={styles.contactMethod}>
                    <div className={styles.iconWrapper}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className={styles.contactText}>
                      <h3>Visit Us</h3>
                      <p>123 Wellness Street, Suite 100</p>
                      <p>Waterloo, CA 94107</p>
                    </div>
                  </div>
                </div>

                <div className={styles.privacyNote}>
                  <p>
                    Your privacy is important to us. All communication is
                    confidential and secure.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactFormSection}>
              <div className={styles.formCard}>
                <h2>Send Us a Message</h2>

                <div className={styles.reasonSelector}>
                  {contactReasons.map((reason) => (
                    <button
                      key={reason.id}
                      className={`${styles.reasonButton} ${selectedReason === reason.id ? styles.active : ""}`}
                      onClick={() => setSelectedReason(reason.id)}
                      title={reason.description}
                    >
                      <span className={styles.reasonIcon}>{reason.icon}</span>
                      <span className={styles.reasonText}>{reason.title}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.selectedReasonDescription}>
                  <p>
                    {
                      contactReasons.find((r) => r.id === selectedReason)
                        ?.description
                    }
                  </p>
                </div>

                {submitSuccess ? (
                  <div className={styles.successMessage}>
                    <FaCheckCircle />
                    <h3>Message Sent Successfully!</h3>
                    <p>
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                  </div>
                ) : (
                  <form className={styles.contactForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Enter subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formActions}>
                      <Button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>

            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3>Is my information private?</h3>
                <p>
                  Yes, your privacy is our priority. All data is encrypted and
                  we never share your personal information with third parties.
                  You can participate anonymously in all community activities.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>How do I connect with experts?</h3>
                <p>
                  You can reach experts by tagging your posts with relevant
                  topics or by directly requesting expert support. Our AI system
                  also identifies posts that might need professional input.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>Do I need to create an account?</h3>
                <p>
                  Yes, an account is required, but you don't need to provide
                  personal identifiers. We use secure password authentication
                  and 12-word passphrases for account recovery.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>Is Bhav available in my country?</h3>
                <p>
                  Bhav is available worldwide, though expert availability may
                  vary by region and time zone. We're constantly expanding our
                  network of verified professionals.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>How can I become a verified expert?</h3>
                <p>
                  Licensed mental health professionals can apply through our
                  verification process. Click "Expert Verification" above to
                  start the application process.
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>Is there a mobile app available?</h3>
                <p>
                  Yes, Bhav is available on iOS and Android platforms. You can
                  download our app from the App Store or Google Play Store.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
