import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ProfileEditor } from "@/components/ProfileEditor";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchMyProfile } from "@/lib/api";
import { ACCENT, GAMES } from "@/lib/config";

export default function ProfileScreen() {
  const {
    user,
    profile,
    userId,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    setProfile,
    clearError,
  } = useUser();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [game, setGame] = useState("dota2");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const onAuth = async () => {
    clearError();
    if (mode === "login") {
      await signIn(username.trim(), password);
    } else {
      await signUp({
        username: username.trim(),
        email: email.trim(),
        password,
        first_name: displayName.trim() || undefined,
        game,
      });
    }
    setPassword("");
  };

  const reloadProfile = async () => {
    if (!userId) return;
    setLoadingProfile(true);
    try {
      setProfile(await fetchMyProfile(userId));
    } catch {
      /* профиль может быть пустым */
    } finally {
      setLoadingProfile(false);
    }
  };

  if (!userId) {
    return (
      <Screen>
        <ThemedText type="subtitle" style={styles.title}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.sub}>
          Поиск тиммейтов для Dota 2, CS2 и Majestic
        </ThemedText>

        <AuthField label="Логин" value={username} onChangeText={setUsername} />
        {mode === "register" && (
          <>
            <AuthField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <AuthField label="Имя в игре" value={displayName} onChangeText={setDisplayName} />
            <ThemedText type="smallBold" style={styles.gameLabel}>
              Игра по умолчанию
            </ThemedText>
            <View style={styles.gameRow}>
              {GAMES.map((g) => (
                <Pressable
                  key={g.code}
                  onPress={() => setGame(g.code)}
                  style={[styles.gameChip, game === g.code && styles.gameChipActive]}>
                  <ThemedText style={game === g.code ? styles.chipActiveText : undefined}>
                    {g.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        )}
        <AuthField
          label="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Pressable
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={onAuth}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.primaryText}>
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </ThemedText>
          )}
        </Pressable>

        <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
          <ThemedText type="linkPrimary" style={styles.switch}>
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </ThemedText>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="subtitle">{user?.username}</ThemedText>
          <ThemedText themeColor="textSecondary">{user?.email}</ThemedText>
        </View>
        <Pressable onPress={signOut}>
          <ThemedText type="linkPrimary">Выйти</ThemedText>
        </Pressable>
      </View>

      {loadingProfile ? (
        <ActivityIndicator color={ACCENT} style={{ marginTop: 24 }} />
      ) : (
        <ProfileEditor
          userId={userId}
          initial={profile}
          onSaved={(p) => {
            setProfile(p);
          }}
        />
      )}

      <Pressable onPress={reloadProfile} style={styles.refresh}>
        <ThemedText type="linkPrimary">Обновить с сервера</ThemedText>
      </Pressable>
    </Screen>
  );
}

function AuthField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences";
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={styles.authInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  sub: {
    marginBottom: 20,
  },
  field: {
    marginBottom: 14,
    gap: 6,
  },
  authInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F0F0F3",
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.7,
  },
  switch: {
    marginTop: 16,
    textAlign: "center",
  },
  error: {
    color: ACCENT,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  refresh: {
    alignItems: "center",
    paddingVertical: 12,
  },
  gameLabel: {
    marginBottom: 8,
  },
  gameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  gameChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F0F0F3",
  },
  gameChipActive: {
    backgroundColor: ACCENT,
  },
  chipActiveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
