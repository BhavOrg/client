import axios from "axios";

const API_URL = "/api";

// Types for request/response
interface RegisterData {
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
  deviceInfo?: DeviceInfo;
}

interface PassphraseLoginData {
  username: string;
  passphrase: string;
  deviceInfo?: DeviceInfo;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
}

interface User {
  user_id: string;
  username: string;
  created_at: string;
  last_login: string | null;
  account_status: string;
}

interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
    passphrase?: string; // Only provided during registration
    expiresAt: number;
    isNewDevice?: boolean; // Included in passphrase login response
  };
}

// Create axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Authentication service
const AuthService = {
  // Register a new user
  register: async (
    username: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>("/auth/register", {
      username,
      password,
    });

    // Store token in localStorage
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data;
  },

  // Login with password (for familiar devices)
  loginWithPassword: async (
    username: string,
    password: string,
  ): Promise<AuthResponse> => {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };

    const response = await authAxios.post<AuthResponse>("/auth/login", {
      username,
      password,
      deviceInfo,
    });

    // Store token in localStorage
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data;
  },

  // Login with passphrase (for new devices)
  loginWithPassphrase: async (
    username: string,
    passphrase: string,
  ): Promise<AuthResponse> => {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };

    const response = await authAxios.post<AuthResponse>(
      "/auth/login/passphrase",
      {
        username,
        passphrase,
        deviceInfo,
      },
    );

    // Store token in localStorage
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }

    return response.data;
  },

  // Logout the current user
  logout: async (): Promise<void> => {
    try {
      await authAxios.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  // Get the current authenticated user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await authAxios.get("/auth/me");
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  },
};

export default AuthService;
