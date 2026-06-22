import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { mediaUrl } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { MatchItem } from "@/types/api";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  match: MatchItem;
  showChatButton?: boolean;
  onPress: () => void;
};

export function MatchRow({ match, showChatButton, onPress }: Props) {
  const theme = useTheme();
  const avatar = mediaUrl(match.avatar_url);
  const initial = match.display_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.85 : 1 },
    ]}>
      <View style={styles.avatarWrap}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, { backgroundColor: ACCENT }]}>
            <ThemedText style={styles.initial}>{initial}</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.name}>{match.display_name}</ThemedText>
        {match.game_label && <ThemedText style={styles.game}>{match.game_label}</ThemedText>}
      </View>

      {showChatButton && match.match_id && (
        <View style={[styles.chatBtn, { backgroundColor: ACCENT + "15" }]}>
          <Ionicons name="chatbubble-ellipses" size={18} color={ACCENT} />
          <ThemedText style={[styles.chatText, { color: ACCENT }]}>Чат</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
    gap: 14,
  },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, overflow: "hidden" },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  initial: { color: "#fff", fontSize: 22, fontWeight: "700" },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "700" },
  game: { fontSize: 13, opacity: 0.5 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  chatText: { fontWeight: "700", fontSize: 14 },
});
