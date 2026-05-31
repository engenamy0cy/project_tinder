import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { saveProfile } from "@/lib/api";
import { ACCENT, GAMES, GENDERS } from "@/lib/config";
import type { ProfileCard } from "@/types/api";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  userId: number;
  initial: ProfileCard | null;
  onSaved: (p: ProfileCard) => void;
};

export function ProfileEditor({ userId, initial, onSaved }: Props) {
  const theme = useTheme();
  const [firstName, setFirstName] = useState(initial?.first_name ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [age, setAge] = useState(initial?.age?.toString() ?? "");
  const [hours, setHours] = useState(initial?.hours_in_game?.toString() ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [game, setGame] = useState(initial?.game ?? "dota2");
  const [gender, setGender] = useState(initial?.gender ?? "dont_indicate");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name);
      setBio(initial.bio);
      setAge(initial.age?.toString() ?? "");
      setHours(initial.hours_in_game?.toString() ?? "");
      setCity(initial.city);
      setGame(initial.game ?? "dota2");
      setGender(initial.gender ?? "dont_indicate");
    }
  }, [initial]);

  const inputStyle = [
    styles.input,
    {
      color: theme.text,
      backgroundColor: theme.backgroundElement,
      borderColor: theme.backgroundSelected,
    },
  ];

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const card = await saveProfile(userId, {
        first_name: firstName.trim(),
        bio: bio.trim(),
        age: age ? parseInt(age, 10) : null,
        hours_in_game: hours ? parseInt(hours, 10) : null,
        city: city.trim(),
        game,
        gender,
      });
      onSaved(card);
      setMessage("Профиль сохранён");
    } catch {
      setMessage("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Field label="Имя">
        <TextInput value={firstName} onChangeText={setFirstName} style={inputStyle} placeholder="Имя" placeholderTextColor={theme.textSecondary} />
      </Field>
      <Field label="О себе">
        <TextInput value={bio} onChangeText={setBio} style={[inputStyle, styles.multiline]} multiline placeholder="Ищу тиммейта..." placeholderTextColor={theme.textSecondary} />
      </Field>
      <Field label="Возраст">
        <TextInput value={age} onChangeText={setAge} style={inputStyle} keyboardType="number-pad" placeholder="18" placeholderTextColor={theme.textSecondary} />
      </Field>
      <Field label="Часы в игре">
        <TextInput value={hours} onChangeText={setHours} style={inputStyle} keyboardType="number-pad" placeholder="500" placeholderTextColor={theme.textSecondary} />
      </Field>
      <Field label="Город">
        <TextInput value={city} onChangeText={setCity} style={inputStyle} placeholder="Москва" placeholderTextColor={theme.textSecondary} />
      </Field>

      <ThemedText type="smallBold" style={styles.section}>
        Основная игра
      </ThemedText>
      <View style={styles.chips}>
        {GAMES.map((g) => (
          <Pressable
            key={g.code}
            onPress={() => setGame(g.code)}
            style={[styles.chip, { backgroundColor: game === g.code ? ACCENT : theme.backgroundElement }]}>
            <ThemedText style={{ color: game === g.code ? "#fff" : theme.text }}>{g.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="smallBold" style={styles.section}>
        Пол
      </ThemedText>
      <View style={styles.chips}>
        {GENDERS.map((g) => (
          <Pressable
            key={g.code}
            onPress={() => setGender(g.code)}
            style={[styles.chip, { backgroundColor: gender === g.code ? ACCENT : theme.backgroundElement }]}>
            <ThemedText style={{ color: gender === g.code ? "#fff" : theme.text }} type="small">
              {g.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.saveBtn, saving && styles.saveDisabled]} onPress={onSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.saveText}>Сохранить профиль</ThemedText>}
      </Pressable>
      {message ? <ThemedText themeColor="textSecondary">{message}</ThemedText> : null}
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingBottom: 32,
    gap: 4,
  },
  field: {
    marginBottom: 12,
    gap: 6,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
