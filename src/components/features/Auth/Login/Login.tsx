import React, { useState } from "react";
import { FaUser, FaLock, FaInfoCircle } from "react-icons/fa";
import Modal from "../../../common/Modal/Modal";
import Input from "../../../common/Input/Input";
import Button from "../../../common/Button/Button";
import styles from "./Login.module.scss";
import useAuth from "../../../../hooks/useAuth";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
  onPassphraseClick: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({
  isOpen,
  onClose,
  onRegisterClick,
  onPassphraseClick,
}) => {
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNewDevice, setIsNewDevice] = useState(false);

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
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      // Use the auth service to log in
      const response = await login(formData.username, formData.password);

      // Check if this is a new device
      if (response.data?.isNewDevice) {
        setIsNewDevice(true);
      } else {
        // Handle successful login
        onClose();
      }
    } catch (error: any) {
      // Handle error
      setErrors({
        general:
          error.response?.data?.message ||
          "Invalid username or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassphraseLogin = () => {
    onPassphraseClick();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
      {isNewDevice ? (
        <div className={styles.newDevicePrompt}>
          <div className={styles.promptIcon}>
            <FaInfoCircle size={40} />
          </div>
          <h3>New Device Detected</h3>
          <p>
            We don't recognize this device. For your security, please log in
            using your recovery passphrase.
          </p>
          <div className={styles.promptActions}>
            <Button variant="primary" fullWidth onClick={handlePassphraseLogin}>
              Continue with Passphrase
            </Button>
            <Button variant="text" onClick={() => setIsNewDevice(false)}>
              Try again with password
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {errors.general && (
            <div className={styles.formError}>{errors.general}</div>
          )}

          {authError && <div className={styles.formError}>{authError}</div>}

          <Input
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            icon={<FaUser />}
            error={errors.username}
            autoComplete="username"
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={<FaLock />}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>

            <div className={styles.alternateActions}>
              <button
                type="button"
                className={styles.textLink}
                onClick={handlePassphraseLogin}
              >
                Use passphrase instead
              </button>

              <div className={styles.registerPrompt}>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className={styles.textLink}
                  onClick={onRegisterClick}
                >
                  Create one now
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default Login;
