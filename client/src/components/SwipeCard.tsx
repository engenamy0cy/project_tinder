import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { mediaUrl } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { ProfileCard } from "@/types/api";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  card: ProfileCard;
};

export function SwipeCard({ card }: Props) {
  const theme = useTheme();
  const avatar = mediaUrl(card.avatar_url);

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.placeholder, { backgroundColor: ACCENT }]}>
          <ThemedText type="title" style={styles.initials}>
            {(card.first_name || card.username).charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.body}>
        <ThemedText type="subtitle" style={styles.name}>
          {card.display_name || card.username}
          {card.age != null ? `, ${card.age}` : ""}
        </ThemedText>

        {card.game_label ? (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{card.game_label}</ThemedText>
          </View>
        ) : null}

        {card.hours_in_game != null ? (
          <ThemedText themeColor="textSecondary">
            {card.hours_in_game} ч. в игре
          </ThemedText>
        ) : null}

        {(card.city || card.country) && (
          <ThemedText themeColor="textSecondary">
            {[card.city, card.country].filter(Boolean).join(", ")}
          </ThemedText>
        )}

        {card.bio ? (
          <ThemedText style={styles.bio} numberOfLines={4}>
            {card.bio}
          </ThemedText>
        ) : (
          <ThemedText themeColor="textSecondary" style={styles.bio}>
            Без описания
          </ThemedText>
        )}

        {card.games.length > 1 && (
          <ThemedText themeColor="textSecondary" type="small">
            Также: {card.games.map((g) => g.label).join(", ")}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
    maxHeight: 520,
  },
  avatar: {
    width: "100%",
    height: 280,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 64,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  bio: {
    marginTop: 8,
    lineHeight: 22,
  },
});
