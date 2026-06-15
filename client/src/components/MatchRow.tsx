import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { mediaUrl } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { MatchItem } from "@/types/api";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  match: MatchItem;
  onPress: () => void;
};

export function MatchRow({ match, onPress }: Props) {
  const theme = useTheme();
  const avatar = mediaUrl(match.avatar_url);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.backgroundElement,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: ACCENT }]}>
          <ThemedText style={styles.initial}>
            {match.display_name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}
      <View style={styles.text}>
        <ThemedText type="smallBold">{match.display_name}</ThemedText>
        {match.game_label ? (
          <ThemedText themeColor="textSecondary" type="small">
            {match.game_label}
          </ThemedText>
        ) : null}
        <ThemedText themeColor="textSecondary" type="small" numberOfLines={1}>
          {match.last_message ?? "Напишите первым сообщение"}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
