import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { ChatPanel } from "@/components/ChatPanel";
import { MatchRow } from "@/components/MatchRow";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchMatches } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { MatchItem } from "@/types/api";

export default function MatchesScreen() {
  const router = useRouter();
  const { userId } = useUser();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MatchItem | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setMatches(await fetchMatches(userId));
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen>
      <ThemedText type="subtitle" style={styles.title}>
        Сообщения
      </ThemedText>

      {!userId ? (
        <View style={styles.authPrompt}>
          <ThemedText themeColor="textSecondary" style={styles.authText}>
            Войдите в аккаунт, чтобы видеть диалоги и общаться с тиммейтами.
          </ThemedText>
          <Pressable onPress={() => router.navigate("/(tabs)/profile")}>
            <ThemedText style={styles.authLink}>Sign In / Register</ThemedText>
          </Pressable>
        </View>
      ) : loading && matches.length === 0 ? (
        <ActivityIndicator color={ACCENT} style={styles.loader} />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(m) => String(m.match_id)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} tintColor={ACCENT} />
          }
          renderItem={({ item }) => (
            <MatchRow match={item} onPress={() => setSelected(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText themeColor="textSecondary">
                Пока нет сообщений. Лайкайте игроков на вкладке «Поиск».
              </ThemedText>
            </View>
          }
        />
      )}

      {userId && (
        <ChatPanel
          visible={!!selected}
          match={selected}
          userId={userId}
          onClose={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    paddingTop: 48,
    alignItems: "center",
  },
  authPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  authText: {
    textAlign: "center",
    maxWidth: "80%",
    fontSize: 16,
  },
  authLink: {
    color: ACCENT,
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
