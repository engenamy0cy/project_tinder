import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-glass-effect";

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
    <View style={[styles.card, { shadowColor: "#000" }]}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
      ) : (
        <View style={[styles.avatar, styles.placeholder, { backgroundColor: "#222" }]}>
          <ThemedText type="title" style={styles.initials}>
            {(card.first_name || card.username).charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.info}>
          <View style={styles.row}>
            <ThemedText style={styles.name}>
              {card.display_name || card.username}
            </ThemedText>
            {card.age != null && (
               <ThemedText style={styles.age}>{card.age}</ThemedText>
            )}
          </View>

          <View style={styles.badges}>
            {card.game_label && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{card.game_label}</ThemedText>
              </View>
            )}
            {card.hours_in_game != null && (
              <View style={[styles.badge, styles.hoursBadge]}>
                <ThemedText style={styles.badgeText}>{card.hours_in_game}h</ThemedText>
              </View>
            )}
          </View>

          {card.bio ? (
            <ThemedText style={styles.bio} numberOfLines={2}>
              {card.bio}
            </ThemedText>
          ) : null}

          {(card.city || card.country) && (
            <ThemedText style={styles.location}>
              {[card.city, card.country].filter(Boolean).join(", ")}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    backgroundColor: "#000",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 80,
    fontWeight: "900",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)", // Fallback gradient/fade could be better but keeping it simple
  },
  info: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  age: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "400",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    backgroundColor: ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  hoursBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  bio: {
    color: "#ddd",
    fontSize: 16,
    lineHeight: 22,
  },
  location: {
    color: "#bbb",
    fontSize: 14,
  },
});
