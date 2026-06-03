import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { login as apiLogin, register as apiRegister } from "@/lib/api";
import type { ProfileCard, UserDto } from "@/types/api";

type UserContextValue = {
  user: UserDto | null;
  profile: ProfileCard | null;
  userId: number | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    game?: string;
  }) => Promise<void>;
  signOut: () => void;
  setProfile: (p: ProfileCard | null) => void;
  clearError: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profile, setProfile] = useState<ProfileCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      setUser(data.user);
      setProfile(data.profile);
    } catch (e: any) {
      const msg = axiosDetail(e) ?? "Login failed. Check server and credentials.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (payload: {
      username: string;
      email: string;
      password: string;
      first_name?: string;
      game?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRegister(payload);
        setUser(data.user);
        setProfile(data.profile);
      } catch (e: any) {
        const msg = axiosDetail(e) ?? "Registration failed.";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      userId: user?.id ?? null,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      setProfile,
      clearError: () => setError(null),
    }),
    [user, profile, loading, error, signIn, signUp, signOut]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

function axiosDetail(e: any): string | null {
  if (e?.response?.data) {
    const data = e.response.data;
    if (data.detail) return String(data.detail);
    if (typeof data === "object") {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) return String(firstError[0]);
    }
  }
  return null;
}
