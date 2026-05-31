import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { ACCENT, ACCENT_DARK } from "@/lib/config";

type Props = {
  onNo: () => void;
  onYes: () => void;
  disabled?: boolean;
};

export function ActionButtons({ onNo, onYes, disabled }: Props) {
  return (
    <View style={styles.row}>
      <CircleButton label="✕" color="#CBD5E1" textColor="#334155" onPress={onNo} disabled={disabled} />
      <CircleButton label="♥" color={ACCENT} textColor="#fff" onPress={onYes} disabled={disabled} large />
    </View>
  );
}

function CircleButton({
  label,
  color,
  textColor,
  onPress,
  disabled,
  large,
}: {
  label: string;
  color: string;
  textColor: string;
  onPress: () => void;
  disabled?: boolean;
  large?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        large && styles.btnLarge,
        { backgroundColor: pressed ? ACCENT_DARK : color, opacity: disabled ? 0.5 : 1 },
      ]}>
      {disabled ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize: large ? 28 : 22 }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    paddingVertical: 16,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  btnLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  label: {
    fontWeight: "700",
  },
});
