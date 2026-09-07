import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getProfile,
  loginUser,
  registerUser,
} from "../api/auth.api";

import type {
  LoginInput,
  RegisterInput,
  User,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<User>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void loadUserProfile();
  }, []);

  const login = async (
    data: LoginInput
  ): Promise<User> => {
    const result = await loginUser(data);

    localStorage.setItem("token", result.token);
    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );

    setUser(result.user);

    return result.user;
  };

  const register = async (
    data: RegisterInput
  ): Promise<void> => {
    await registerUser(data);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}