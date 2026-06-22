import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { ChatPanel } from "@/components/ChatPanel";
import { MatchRow } from "@/components/MatchRow";
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchIncomingLikes, fetchLikes, fetchMatches } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { MatchItem } from "@/types/api";

type SectionType = "incoming" | "match" | "outgoing";
type Section = { type: SectionType; data: MatchItem };

export default function MatchesScreen() {
  const { userId } = useUser();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MatchItem | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [matches, likes, incoming] = await Promise.all([
        fetchMatches(userId),
        fetchLikes(userId),
        fetchIncomingLikes(userId),
      ]);
      const items: Section[] = [
        ...incoming.map((l) => ({ type: "incoming" as const, data: l })),
        ...matches.map((m) => ({ type: "match" as const, data: m })),
        ...likes.map((l) => ({ type: "outgoing" as const, data: l })),
      ];
      setSections(items);
    } catch { setSections([]); } finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const showProfile = (item: MatchItem, type: SectionType) => {
    const label = type === "incoming" ? "Вас лайкнул" : "Вы лайкнули";
    const desc = [
      item.display_name,
      item.game_label ? `Игра: ${item.game_label}` : "",
      type === "match" ? "Есть взаимный лайк!" : "Ожидание ответного лайка",
    ].filter(Boolean).join("\n");
    Alert.alert(label, desc);
  };

  if (!userId) {
    return (
      <Screen>
        <ThemedText style={styles.title}>Сообщения</ThemedText>
        <ThemedText style={styles.hint}>Войдите в аккаунт, чтобы видеть диалоги</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText style={styles.title}>Сообщения</ThemedText>

      {loading && sections.length === 0 ? (
        <ActivityIndicator color={ACCENT} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => `${s.type}-${s.data.user_id}`}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={ACCENT} />}
          renderItem={({ item: s }) => (
            <MatchRow
              match={s.data}
              showChatButton={s.type === "match"}
              onPress={
                s.type === "match"
                  ? () => setSelected(s.data)
                  : () => showProfile(s.data, s.type)
              }
            />
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 48, alignItems: "center" }}>
              <ThemedText style={styles.hint}>Нет совпадений. Лайкай игроков на вкладке «Поиск»</ThemedText>
            </View>
          }
        />
      )}

      <ChatPanel
        visible={!!selected}
        match={selected}
        userId={userId!}
        onClose={() => { setSelected(null); load(); }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "800", marginBottom: 16 },
  hint: { opacity: 0.5, fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
});
