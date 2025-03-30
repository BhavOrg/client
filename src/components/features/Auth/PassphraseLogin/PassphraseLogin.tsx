import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { FaUser, FaKey, FaArrowLeft } from "react-icons/fa";
import Modal from "../../../common/Modal/Modal";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./PassphraseLogin.module.scss";
import useAuth from "../../../../hooks/useAuth";

interface PassphraseLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordLoginClick: () => void;
}

const PassphraseLogin: React.FC<PassphraseLoginProps> = ({
  isOpen,
  onClose,
  onPasswordLoginClick,
}) => {
  const { loginWithPassphrase } = useAuth();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passphraseWords, setPassphraseWords] = useState<string[]>(
    Array(12).fill(""),
  );
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create an array of refs for the 12 input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(12).fill(null));

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameError) setUsernameError(undefined);
  };

  // For PassphraseLogin.tsx
  const handleWordChange = (index: number, value: string) => {
    // Check if a space was entered (which would indicate finishing a word)
    const containsSpace = value.includes(" ");

    // If space is detected, split the value and move the extra content to next input
    if (containsSpace) {
      const parts = value.split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        // Update current word
        const newWords = [...passphraseWords];
        newWords[index] = parts[0].trim().toLowerCase();

        // If there are additional words and we're not at the last box,
        // move them to the next box(es)
        if (parts.length > 1 && index < 11) {
          // Place the second word in the next box
          newWords[index + 1] = parts[1].trim().toLowerCase();

          // Update the state
          setPassphraseWords(newWords);

          // Focus the next box
          setTimeout(() => {
            inputRefs.current[index + 1]?.focus();
          }, 0);
          return;
        }

        setPassphraseWords(newWords);
      }
    } else {
      // Regular update without auto-moving to the next field
      const newWords = [...passphraseWords];
      newWords[index] = value.trim().toLowerCase();
      setPassphraseWords(newWords);
    }

    // Clear general errors when user types
    if (errors) setErrors(null);
  };

  // Additionally, let's enhance the handleKeyDown function to handle the tab key properly
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace on empty input to go back to previous input
    if (e.key === "Backspace" && !passphraseWords[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow to move to next input
    if (e.key === "ArrowRight" && index < 11) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle left arrow to move to previous input
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    }

    const emptyWordIndex = passphraseWords.findIndex((word) => !word);
    if (emptyWordIndex !== -1) {
      setErrors(
        `Please enter all 12 words. Word #${emptyWordIndex + 1} is empty.`,
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Join the passphrase words with spaces
      const passphrase = passphraseWords.join(" ");
      await loginWithPassphrase(username, passphrase);
      onClose();
    } catch (error: any) {
      setErrors(
        error.response?.data?.message ||
          "Login failed. Please check your username and passphrase.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const words = pastedText.trim().toLowerCase().split(/\s+/);

    // Only use first 12 words if more were pasted
    const validWords = words.slice(0, 12);

    // Fill in as many words as possible
    const newPassphraseWords = [...passphraseWords];
    validWords.forEach((word, index) => {
      if (index < 12) {
        newPassphraseWords[index] = word;
      }
    });

    setPassphraseWords(newPassphraseWords);

    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newPassphraseWords.findIndex((word) => !word);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[11]?.focus();
    }
  };

  // Create a function to set refs properly
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login with Recovery Passphrase"
    >
      <form onSubmit={handleSubmit} className={styles.passphraseForm}>
        <div className={styles.infoBox}>
          <p>
            Use your 12-word recovery passphrase to log in from a new device.
            After logging in, you'll be able to use your password for future
            logins on this device.
          </p>
        </div>

        {errors && <div className={styles.formError}>{errors}</div>}

        <Input
          label="Username"
          id="passphrase-username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
          icon={<FaUser />}
          error={usernameError}
          autoComplete="username"
        />

        <div className={styles.passphraseContainer}>
          <label className={styles.passphraseLabel}>
            <div className={styles.labelWithIcon}>
              <FaKey />
              <span>Recovery Passphrase</span>
            </div>
          </label>

          <div className={styles.passphraseInputGrid}>
            {passphraseWords.map((word, index) => (
              <div key={index} className={styles.wordInputContainer}>
                <span className={styles.wordNumber}>{index + 1}</span>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={styles.wordInput}
                  placeholder={`Word ${index + 1}`}
                  ref={setInputRef(index)}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>

          <div className={styles.passphraseHelp}>
            <p>
              Enter all 12 words from your recovery passphrase in the correct
              order.
            </p>
            <p className={styles.smallTip}>
              Tip: You can paste your entire passphrase into the first box.
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            loadingText="Verifying..."
          >
            Log In with Passphrase
          </Button>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onPasswordLoginClick}
            icon={<FaArrowLeft />}
            iconPosition="left"
          >
            Back to Password Login
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PassphraseLogin;
