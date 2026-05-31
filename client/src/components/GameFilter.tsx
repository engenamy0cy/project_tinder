import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { ACCENT, GAMES } from "@/lib/config";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  value: string | null;
  onChange: (code: string | null) => void;
};

export function GameFilter({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      <Chip
        label="Все игры"
        active={value === null}
        onPress={() => onChange(null)}
        theme={theme}
      />
      {GAMES.map((g) => (
        <Chip
          key={g.code}
          label={g.label}
          active={value === g.code}
          onPress={() => onChange(g.code)}
          theme={theme}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? ACCENT : theme.backgroundElement,
        },
      ]}>
      <Text style={[styles.chipText, { color: active ? "#fff" : theme.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
