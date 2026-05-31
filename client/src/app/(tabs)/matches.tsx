import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { ChatPanel } from "@/components/ChatPanel";
import { MatchRow } from "@/components/MatchRow";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchMatches } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { MatchItem } from "@/types/api";

export default function MatchesScreen() {
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

  if (!userId) {
    return (
      <Screen>
        <ThemedText type="subtitle">Матчи</ThemedText>
        <ThemedText themeColor="textSecondary">
          Войдите в аккаунт, чтобы видеть взаимные лайки и переписку.
        </ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText type="subtitle" style={styles.title}>
        Матчи
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.hint}>
        Взаимные лайки — можно писать сообщения
      </ThemedText>

      {loading && matches.length === 0 ? (
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
                Пока нет матчей. Лайкайте игроков на вкладке «Поиск».
              </ThemedText>
            </View>
          }
        />
      )}

      <ChatPanel
        visible={!!selected}
        match={selected}
        userId={userId}
        onClose={() => {
          setSelected(null);
          load();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  hint: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    paddingTop: 48,
    alignItems: "center",
  },
});
