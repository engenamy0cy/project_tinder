import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from "react-native";

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
    if (!userId) return;
    setLoading(true);
    try {
      const cards = await fetchFeed(userId, game ?? undefined);
      setQueue(cards);
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [userId, game]);

  useEffect(() => {
    load();
  }, [load]);

  const current = queue[0];

  const advance = () => setQueue((q) => q.slice(1));

  const onAction = async (action: "yes" | "no") => {
    if (!userId || !current || acting) return;
    setActing(true);
    try {
      const res = await swipe(userId, current.user_id, action);
      if (res.match) {
        Alert.alert("It's a Match!", `You matched with ${current.display_name}`);
      }
      advance();
      if (queue.length <= 1) load();
    } catch {
      Alert.alert("Error", "Action failed");
    } finally {
      setActing(false);
    }
  };

  if (!userId) {
    return (
      <Screen style={styles.authGate}>
        <ThemedText type="title" style={styles.gateTitle}>TeamUp</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.gateSub}>
          Join the community to find your next squad.
        </ThemedText>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>TeamUp</ThemedText>
      </View>

      <View style={styles.filterContainer}>
        <GameFilter value={game} onChange={setGame} />
      </View>

      <View style={styles.deck}>
        {loading ? (
          <ActivityIndicator size="large" color={ACCENT} style={styles.center} />
        ) : current ? (
          <SwipeCard card={current} />
        ) : (
          <View style={styles.empty}>
            <ThemedText type="subtitle">No one left!</ThemedText>
            <ThemedText themeColor="textSecondary">
              Try changing filters or check back later.
            </ThemedText>
          </View>
        )}
      </View>

      {current ? (
        <View style={styles.actions}>
          <ActionButtons
            onNo={() => onAction("no")}
            onYes={() => onAction("yes")}
            disabled={acting}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  authGate: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  gateTitle: {
    fontSize: 42,
    color: ACCENT,
    marginBottom: 8,
  },
  gateSub: {
    fontSize: 18,
    textAlign: "center",
    maxWidth: "80%",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: ACCENT,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  deck: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  actions: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  }
});
