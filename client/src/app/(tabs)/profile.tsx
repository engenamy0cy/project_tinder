import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from "react-native";

import { ProfileEditor } from "@/components/ProfileEditor";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchMyProfile } from "@/lib/api";
import { ACCENT, GAMES } from "@/lib/config";
import { useTheme } from "@/hooks/use-theme";

export default function ProfileScreen() {
  const theme = useTheme();
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
    try {
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
    } catch(e) {}
    setPassword("");
  };

  const reloadProfile = async () => {
    if (!userId) return;
    setLoadingProfile(true);
    try {
      setProfile(await fetchMyProfile(userId));
    } catch {} finally {
      setLoadingProfile(false);
    }
  };

  if (!userId) {
    return (
      <Screen style={styles.authContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title" style={styles.title}>
            {mode === "login" ? "Welcome back" : "Create account"}
            </ThemedText>

            <View style={styles.form}>
                <AuthField label="Username" value={username} onChangeText={setUsername} />
                {mode === "register" && (
                <>
                    <AuthField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
                    <AuthField label="In-game Name" value={displayName} onChangeText={setDisplayName} />
                    <ThemedText type="smallBold" style={styles.gameLabel}>Main Game</ThemedText>
                    <View style={styles.gameRow}>
                    {GAMES.map((g) => (
                        <Pressable
                        key={g.code}
                        onPress={() => setGame(g.code)}
                        style={[styles.gameChip, game === g.code && styles.gameChipActive]}>
                        <ThemedText style={[styles.gameChipText, game === g.code && styles.chipActiveText]}>
                            {g.label}
                        </ThemedText>
                        </Pressable>
                    ))}
                    </View>
                </>
                )}
                <AuthField
                    label="Password"
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
                    {mode === "login" ? "Sign In" : "Sign Up"}
                    </ThemedText>
                )}
                </Pressable>

                <Pressable onPress={() => {
                    setMode(mode === "login" ? "register" : "login");
                    clearError();
                }}>
                <ThemedText style={styles.switch}>
                    {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
                </ThemedText>
                </Pressable>
            </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle" style={styles.username}>{user?.username}</ThemedText>
          <ThemedText themeColor="textSecondary">{user?.email}</ThemedText>
        </View>
        <Pressable onPress={signOut} style={styles.logoutBtn}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </Pressable>
      </View>

      <View style={styles.editorContainer}>
        {loadingProfile ? (
            <ActivityIndicator color={ACCENT} size="large" style={{ marginTop: 40 }} />
        ) : (
            <ProfileEditor
            userId={userId}
            initial={profile}
            onSaved={(p) => {
                setProfile(p);
            }}
            />
        )}
      </View>
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
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" style={styles.label}>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={[styles.authInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        placeholderTextColor={theme.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 32,
    color: ACCENT,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  authInput: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  disabled: {
    opacity: 0.7,
  },
  switch: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  error: {
    color: ACCENT,
    textAlign: "center",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  logoutText: {
    color: "#666",
    fontWeight: "600",
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gameLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginBottom: 4,
  },
  gameRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  gameChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  gameChipActive: {
    backgroundColor: ACCENT,
  },
  gameChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  chipActiveText: {
    color: "#fff",
  },
});
