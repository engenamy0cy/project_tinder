import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";

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
  const router = useRouter();
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

      {userId && current ? (
        <View style={styles.actions}>
          <ActionButtons
            onNo={() => onAction("no")}
            onYes={() => onAction("yes")}
            disabled={acting}
          />
        </View>
      ) : !userId ? (
        <Pressable onPress={() => router.navigate("/(tabs)/profile")} style={styles.authPrompt}>
          <ThemedText style={styles.authPromptText}>
            Sign in to like and match with players
          </ThemedText>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  authPrompt: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  authPromptText: {
    color: ACCENT,
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
