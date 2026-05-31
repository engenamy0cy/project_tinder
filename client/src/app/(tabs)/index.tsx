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
        Alert.alert("Это матч!", `Вы понравились ${current.display_name}`);
      }
      advance();
      if (queue.length <= 1) load();
    } catch {
      Alert.alert("Ошибка", "Не удалось отправить действие");
    } finally {
      setActing(false);
    }
  };

  if (!userId) {
    return (
      <Screen>
        <ThemedText type="subtitle">Войдите в профиле</ThemedText>
        <ThemedText themeColor="textSecondary">
          Чтобы смотреть анкеты, создайте аккаунт на вкладке «Профиль».
        </ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText type="subtitle" style={styles.title}>
        TeamUp
      </ThemedText>
      <GameFilter value={game} onChange={setGame} />

      <View style={styles.deck}>
        {loading ? (
          <ActivityIndicator size="large" color={ACCENT} style={styles.center} />
        ) : current ? (
          <SwipeCard card={current} />
        ) : (
          <View style={styles.empty}>
            <ThemedText type="subtitle">Анкеты закончились</ThemedText>
            <ThemedText themeColor="textSecondary">
              Смените фильтр или зайдите позже
            </ThemedText>
          </View>
        )}
      </View>

      {current ? (
        <ActionButtons
          onNo={() => onAction("no")}
          onYes={() => onAction("yes")}
          disabled={acting}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  deck: {
    flex: 1,
    marginTop: 8,
  },
  center: {
    marginTop: 80,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
