import { Ionicons } from "@expo/vector-icons";
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
import { ACCENT, GAMES } from "@/lib/config";
import { useTheme } from "@/hooks/use-theme";

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, profile, userId, loading, error, signIn, signUp, signOut, setProfile, clearError } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [game, setGame] = useState("dota2");
  const onAuth = async () => {
    clearError();
    try {
      if (mode === "login") {
        await signIn(username.trim(), password);
      } else {
        await signUp({ username: username.trim(), email: email.trim(), password, first_name: displayName.trim() || undefined, game });
      }
      setPassword("");
    } catch {}
  };

  if (!userId) {
    return (
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <ThemedText style={styles.title}>{mode === "login" ? "Вход" : "Регистрация"}</ThemedText>

          <View style={styles.form}>
            <Field label="Логин" value={username} onChangeText={setUsername} theme={theme} />

            {mode === "register" && (
              <>
                <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" theme={theme} />
                <Field label="Имя в игре" value={displayName} onChangeText={setDisplayName} theme={theme} />
                <ThemedText style={styles.sectionLabel}>Основная игра</ThemedText>
                <View style={styles.chips}>
                  {GAMES.map((g) => (
                    <Pressable key={g.code} onPress={() => setGame(g.code)}
                      style={[styles.chip, { backgroundColor: game === g.code ? ACCENT : theme.backgroundElement }]}>
                      <ThemedText style={{ color: game === g.code ? "#fff" : theme.text, fontSize: 13, fontWeight: "600" }}>{g.label}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <View style={styles.passRow}>
              <Field label="Пароль" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} containerStyle={{ flex: 1 }} theme={theme} />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={[styles.eyeBtn, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={theme.textSecondary} />
              </Pressable>
            </View>

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            <Pressable style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={onAuth} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.primaryText}>{mode === "login" ? "Войти" : "Зарегистрироваться"}</ThemedText>}
            </Pressable>

            <Pressable onPress={() => { setMode(mode === "login" ? "register" : "login"); clearError(); }}>
              <ThemedText style={styles.switch}>
                {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerName}>{user?.username}</ThemedText>
          <ThemedText style={styles.headerEmail}>{user?.email}</ThemedText>
        </View>
        <Pressable onPress={signOut} style={[styles.logoutBtn, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText style={styles.logoutText}>Выйти</ThemedText>
        </Pressable>
      </View>

      <ProfileEditor userId={userId} initial={profile} onSaved={(p) => setProfile(p)} />
    </Screen>
  );
}

function Field({ label, value, onChangeText, secureTextEntry, autoCapitalize, containerStyle, theme }: {
  label: string; value: string; onChangeText: (t: string) => void; secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences"; containerStyle?: any; theme: any;
}) {
  return (
    <View style={[styles.field, containerStyle]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        placeholderTextColor={theme.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 34, fontWeight: "900", marginBottom: 32, color: ACCENT },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", opacity: 0.6, marginLeft: 4 },
  input: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  passRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  eyeBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sectionLabel: { fontSize: 13, fontWeight: "600", opacity: 0.6, marginLeft: 4, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  primaryBtn: {
    backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 8,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  switch: { marginTop: 20, textAlign: "center", opacity: 0.5, fontSize: 14 },
  error: { color: ACCENT, textAlign: "center", fontWeight: "600" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 16, marginBottom: 8,
  },
  headerName: { fontSize: 24, fontWeight: "800" },
  headerEmail: { fontSize: 14, opacity: 0.5, marginTop: 2 },
  logoutBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  logoutText: { fontWeight: "600", opacity: 0.6 },
});
