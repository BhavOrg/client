import React, { useState, useRef } from "react";
import {
  FaUser,
  FaLock,
  FaCheckCircle,
  FaCopy,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import Modal from "../../..//common/Modal/Modal";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./Register.module.scss";
import useAuth from "../../../../hooks/useAuth";

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Register: React.FC<RegisterProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "form" | "passphrase" | "verification"
  >("form");
  const [passphrase, setPassphrase] = useState<string[]>([]);
  const [verificationInput, setVerificationInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPassphraseCopied, setIsPassphraseCopied] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Now we're using register that was extracted at the component level
      const response = await register(formData.username, formData.password);

      if (response.data.passphrase) {
        const receivedPassphrase = response.data.passphrase.split(" ");
        setPassphrase(receivedPassphrase);
        setCurrentStep("passphrase");
      }
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassphraseCopy = () => {
    navigator.clipboard.writeText(passphrase.join(" ")).then(
      () => {
        setIsPassphraseCopied(true);
        setTimeout(() => setIsPassphraseCopied(false), 3000);
      },
      () => {
        console.error("Failed to copy passphrase");
      },
    );
  };

  const handleVerificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setVerificationInput(e.target.value);
    setVerificationError(null);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Check if verification matches passphrase
    const isCorrect =
      verificationInput.trim().toLowerCase() ===
      passphrase.join(" ").toLowerCase();

    setTimeout(() => {
      if (isCorrect) {
        // Registration complete
        onClose();
        // In a real app, you'd also handle login here
      } else {
        setVerificationError(
          "The passphrase you entered doesn't match. Please try again.",
        );
      }
      setIsVerifying(false);
    }, 1000);
  };

  const goToVerification = () => {
    setCurrentStep("verification");
  };

  const goBackToPassphrase = () => {
    setCurrentStep("passphrase");
    setVerificationInput("");
    setVerificationError(null);
  };

  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      {errors.general && (
        <div className={styles.formError}>{errors.general}</div>
      )}

      <Input
        label="Username"
        id="register-username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Choose a username"
        icon={<FaUser />}
        error={errors.username}
        autoComplete="username"
      />

      <Input
        label="Password"
        id="register-password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a strong password"
        icon={<FaLock />}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        label="Confirm Password"
        id="register-confirm-password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        icon={<FaLock />}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <div className={styles.privacyNote}>
        <p>
          <strong>Privacy Note:</strong> We don't collect any personal
          information like email or phone numbers to maintain your complete
          anonymity.
        </p>
      </div>

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Creating account..."
        >
          Create Account
        </Button>

        <div className={styles.loginPrompt}>
          <span>Already have an account?</span>
          <button
            type="button"
            className={styles.textLink}
            onClick={onLoginClick}
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
  );

  const renderPassphraseStep = () => (
    <div className={styles.passphraseContainer}>
      <div className={styles.passphraseHeader}>
        <FaExclamationTriangle className={styles.warningIcon} />
        <h3>Save Your Recovery Passphrase</h3>
      </div>

      <div className={styles.passphraseInstructions}>
        <p>
          This 12-word passphrase is your <strong>only way</strong> to recover
          your account or log in from new devices. Please write it down and
          store it in a safe place.
        </p>
      </div>

      <div className={styles.passphraseBox}>
        <div className={styles.passphraseWords}>
          {passphrase.map((word, index) => (
            <div key={index} className={styles.passphraseWord}>
              <span className={styles.wordNumber}>{index + 1}</span>
              <span className={styles.word}>{word}</span>
            </div>
          ))}
        </div>

        <button
          className={styles.copyButton}
          onClick={handlePassphraseCopy}
          type="button"
        >
          {isPassphraseCopied ? (
            <>
              <FaCheckCircle /> Copied
            </>
          ) : (
            <>
              <FaCopy /> Copy Passphrase
            </>
          )}
        </button>
      </div>

      <div className={styles.passphraseWarning}>
        <p>
          <strong>WARNING:</strong> If you lose this passphrase, you will
          permanently lose access to your account. We cannot recover it for you.
        </p>
      </div>

      <Button variant="primary" fullWidth onClick={goToVerification}>
        I've Saved My Passphrase
      </Button>
    </div>
  );

  // This is a partial code snippet to replace the renderVerificationStep function in Register.tsx

  const renderVerificationStep = () => {
    // Create an array of refs for the 12 input boxes
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(12).fill(null));

    // State for individual words
    const [verificationWords, setVerificationWords] = useState<string[]>(
      Array(12).fill(""),
    );

    // For Register.tsx (inside renderVerificationStep)
    const handleWordChange = (index: number, value: string) => {
      // Check if a space was entered (which would indicate finishing a word)
      const containsSpace = value.includes(" ");

      // If space is detected, split the value and move the extra content to next input
      if (containsSpace) {
        const parts = value.split(/\s+/).filter(Boolean);
        if (parts.length > 0) {
          // Update current word
          const newWords = [...verificationWords];
          newWords[index] = parts[0].trim().toLowerCase();

          // If there are additional words and we're not at the last box,
          // move them to the next box(es)
          if (parts.length > 1 && index < 11) {
            // Place the second word in the next box
            newWords[index + 1] = parts[1].trim().toLowerCase();

            // Update the state
            setVerificationWords(newWords);

            // Focus the next box
            setTimeout(() => {
              inputRefs.current[index + 1]?.focus();
            }, 0);
            return;
          }

          setVerificationWords(newWords);
        }
      } else {
        // Regular update without auto-moving to the next field
        const newWords = [...verificationWords];
        newWords[index] = value.trim().toLowerCase();
        setVerificationWords(newWords);
      }

      // Clear error when user types
      if (verificationError) setVerificationError(null);
    };

    // Enhanced handleKeyDown for Register verification
    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      // Handle backspace on empty input to go back to previous input
      if (e.key === "Backspace" && !verificationWords[index] && index > 0) {
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

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const words = pastedText.trim().toLowerCase().split(/\s+/);

      // Only use first 12 words if more were pasted
      const validWords = words.slice(0, 12);

      // Fill in as many words as possible
      const newWords = [...verificationWords];
      validWords.forEach((word, index) => {
        if (index < 12) {
          newWords[index] = word;
        }
      });

      setVerificationWords(newWords);

      // Focus the next empty input or the last one if all filled
      const nextEmptyIndex = newWords.findIndex((word) => !word);
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

    const handleVerificationSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Check if any word is empty
      if (verificationWords.some((word) => !word)) {
        setVerificationError("Please enter all 12 words of your passphrase.");
        return;
      }

      setIsVerifying(true);

      // Join the words with spaces and check against the original passphrase
      const enteredPassphrase = verificationWords.join(" ").toLowerCase();
      const originalPassphrase = passphrase.join(" ").toLowerCase();

      setTimeout(() => {
        if (enteredPassphrase === originalPassphrase) {
          // Registration complete
          onClose();
          // In a real app, you'd also handle login here
        } else {
          setVerificationError(
            "The passphrase you entered doesn't match. Please try again.",
          );
        }
        setIsVerifying(false);
      }, 1000);
    };

    return (
      <form
        onSubmit={handleVerificationSubmit}
        className={styles.verificationForm}
      >
        <button
          type="button"
          className={styles.backButton}
          onClick={goBackToPassphrase}
        >
          <FaArrowLeft /> Back to Passphrase
        </button>

        <div className={styles.verificationHeader}>
          <FaCheckCircle className={styles.verificationIcon} />
          <h3>Verify Your Passphrase</h3>
        </div>

        <p className={styles.verificationInstructions}>
          To ensure you've saved your passphrase correctly, please enter all 12
          words in the correct order.
        </p>

        <div className={styles.verificationInputContainer}>
          <div className={styles.passphraseInputGrid}>
            {verificationWords.map((word, index) => (
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

          {verificationError && (
            <div className={styles.verificationError}>{verificationError}</div>
          )}

          <div className={styles.passphraseHelp}>
            <p className={styles.smallTip}>
              Tip: You can paste your entire passphrase into the first box.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isVerifying}
          loadingText="Verifying..."
        >
          Complete Registration
        </Button>
      </form>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case "form":
        return renderFormStep();
      case "passphrase":
        return renderPassphraseStep();
      case "verification":
        return renderVerificationStep();
      default:
        return renderFormStep();
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case "form":
        return "Create Your Anonymous Account";
      case "passphrase":
        return "Important Security Step";
      case "verification":
        return "Verify Your Recovery Passphrase";
      default:
        return "Register";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        currentStep === "form"
          ? onClose
          : () => {
              if (
                confirm(
                  "Are you sure you want to exit? Your registration progress will be lost.",
                )
              ) {
                onClose();
              }
            }
      }
      title={getModalTitle()}
    >
      {renderContent()}
    </Modal>
  );
};

export default Register;
