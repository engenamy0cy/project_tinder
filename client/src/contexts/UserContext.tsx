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
    } catch (e: unknown) {
      const msg =
        axiosDetail(e) ?? "Не удалось войти. Проверьте сервер и логин.";
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
      } catch (e: unknown) {
        const msg = axiosDetail(e) ?? "Не удалось зарегистрироваться.";
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

function axiosDetail(e: unknown): string | null {
  if (typeof e === "object" && e !== null && "response" in e) {
    const res = (e as { response?: { data?: { detail?: string } } }).response;
    if (res?.data?.detail) return String(res.data.detail);
  }
  return null;
}
