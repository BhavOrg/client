import React, { useState, useEffect } from "react";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import PassphraseLogin from "../Auth/PassphraseLogin/PassphraseLogin";

type AuthView = "login" | "register" | "passphrase";

interface AuthDialogProps {
  initialView?: AuthView;
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  initialView = "login",
  isOpen,
  onClose,
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPassphraseOpen, setIsPassphraseOpen] = useState(false);

  // Set initial state when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialView === "login") setIsLoginOpen(true);
      else if (initialView === "register") setIsRegisterOpen(true);
      else if (initialView === "passphrase") setIsPassphraseOpen(true);
    } else {
      // Close all when main dialog closes
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
      setIsPassphraseOpen(false);
    }
  }, [isOpen, initialView]);

  // Handle view transitions
  const handleViewChange = (view: AuthView) => {
    // First close all current views
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsPassphraseOpen(false);

    // Set the current view for tracking
    setCurrentView(view);

    // Use a slight delay to ensure the previous modal closes before opening the new one
    setTimeout(() => {
      if (view === "login") setIsLoginOpen(true);
      else if (view === "register") setIsRegisterOpen(true);
      else if (view === "passphrase") setIsPassphraseOpen(true);
    }, 50);
  };

  return (
    <>
      <Login
        isOpen={isLoginOpen}
        onClose={onClose}
        onRegisterClick={() => handleViewChange("register")}
        onPassphraseClick={() => handleViewChange("passphrase")}
      />

      <Register
        isOpen={isRegisterOpen}
        onClose={onClose}
        onLoginClick={() => handleViewChange("login")}
      />

      <PassphraseLogin
        isOpen={isPassphraseOpen}
        onClose={onClose}
        onPasswordLoginClick={() => handleViewChange("login")}
      />
    </>
  );
};

export default AuthDialog;
