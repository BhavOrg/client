import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import AuthService from "../services/authService";

interface User {
  user_id: string;
  username: string;
  created_at: string;
  last_login: string | null;
  account_status: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<any>;
  loginWithPassphrase: (username: string, passphrase: string) => Promise<any>;
  register: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  triggerLogin: () => void;
  openAuthDialog: boolean;
  setOpenAuthDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({}),
  loginWithPassphrase: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
  error: null,
  clearError: () => {},
  triggerLogin: () => {},
  openAuthDialog: false,
  setOpenAuthDialog: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({
  children,
}: AuthProviderProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        // If token is invalid, clear it
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Trigger login dialog
  const triggerLogin = useCallback(() => {
    setOpenAuthDialog(true);
  }, []);

  // Login with password
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.loginWithPassword(username, password);
      setUser(response.data.user);
      setError(null);
      setOpenAuthDialog(false);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with passphrase
  const loginWithPassphrase = useCallback(
    async (username: string, passphrase: string) => {
      setIsLoading(true);
      try {
        const response = await AuthService.loginWithPassphrase(
          username,
          passphrase,
        );
        setUser(response.data.user);
        setError(null);
        setOpenAuthDialog(false);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Login failed. Please try again.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Register
  const register = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(username, password);
      setUser(response.data.user);
      setError(null);
      setOpenAuthDialog(false);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      // Even if logout fails, remove user from state
      setUser(null);
      localStorage.removeItem("token");
    }
  }, []);

  // Return the Provider component with all the values
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithPassphrase,
        register,
        logout,
        error,
        clearError,
        triggerLogin,
        openAuthDialog,
        setOpenAuthDialog,
      },
    },
    children,
  );
};

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
