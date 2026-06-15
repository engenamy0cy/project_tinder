import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const SESSION_KEY = "teampick_session";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profile, setProfile] = useState<ProfileCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) {
          const { user, profile } = JSON.parse(saved);
          setUser(user);
          setProfile(profile);
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setInitializing(false);
      }
    };
    loadSession();
  }, []);

  const saveSession = async (user: UserDto, profile: ProfileCard | null) => {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ user, profile }));
    } catch (e) {
      console.error("Failed to save session", e);
    }
  };

  const signIn = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      setUser(data.user);
      setProfile(data.profile);
      await saveSession(data.user, data.profile);
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
        await saveSession(data.user, data.profile);
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
    AsyncStorage.removeItem(SESSION_KEY);
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
      setProfile: (p: ProfileCard | null) => {
          setProfile(p);
          if (user) saveSession(user, p);
      },
      clearError: () => setError(null),
    }),
    [user, profile, loading, error, signIn, signUp, signOut]
  );

  if (initializing) return null;

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
