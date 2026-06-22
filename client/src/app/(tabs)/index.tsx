import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { ActionButtons } from "@/components/ActionButtons";
import { GameFilter } from "@/components/GameFilter";
import { Screen } from "@/components/Screen";
import { SwipeCard } from "@/components/SwipeCard";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchFeed, swipe } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { ProfileCard } from "@/types/api";

export default function DiscoverScreen() {
  const { userId } = useUser();
  const [game, setGame] = useState<string | null>(null);
  const [queue, setQueue] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cards = await fetchFeed(userId ?? undefined, game ?? undefined);
      setQueue(cards);
    } catch { setQueue([]); } finally { setLoading(false); }
  }, [userId, game]);

  useEffect(() => { load(); }, [load]);

  const current = queue[0];
  const advance = () => setQueue((q) => q.slice(1));

  const onAction = async (action: "yes" | "no") => {
    if (!userId) { router.push("/(tabs)/profile"); return; }
    if (!current || acting) return;
    setActing(true);
    try {
      const res = await swipe(userId, current.user_id, action);
      if (res.match) Alert.alert("Это мэтч!", `Ты и ${current.display_name} понравились друг другу`);
      advance();
      if (queue.length <= 1) load();
    } catch { Alert.alert("Ошибка", "Не удалось выполнить действие"); } finally { setActing(false); }
  };

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>TeamUp</ThemedText>
        {!userId && <ThemedText style={styles.guestHint}>Войди в профиль, чтобы лайкать</ThemedText>}
      </View>

      <View style={styles.filterWrap}>
        <GameFilter value={game} onChange={setGame} />
      </View>

      <View style={styles.deck}>
        {loading ? (
          <ActivityIndicator size="large" color={ACCENT} style={{ flex: 1 }} />
        ) : current ? (
          <SwipeCard card={current} />
        ) : (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyTitle}>Больше никого нет</ThemedText>
            <ThemedText style={styles.emptyHint}>Попробуй другие фильтры или зайди позже</ThemedText>
          </View>
        )}
      </View>

      {current && (
        <View style={styles.actions}>
          <ActionButtons onNo={() => onAction("no")} onYes={() => onAction("yes")} disabled={acting} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 },
  title: { fontSize: 32, fontWeight: "900", color: ACCENT },
  guestHint: { fontSize: 13, opacity: 0.5, marginTop: 2 },
  filterWrap: { paddingHorizontal: 16, marginBottom: 8 },
  deck: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700", opacity: 0.6 },
  emptyHint: { fontSize: 14, opacity: 0.4 },
  actions: { paddingBottom: 30, paddingHorizontal: 20 },
});
