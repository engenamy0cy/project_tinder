import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/themed-text";
import { mediaUrl, saveProfile } from "@/lib/api";
import { ACCENT, GAMES, GENDERS, COUNTRIES } from "@/lib/config";
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
  const [country, setCountry] = useState(initial?.country ?? "");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [game, setGame] = useState(initial?.game ?? "dota2");
  const [gender, setGender] = useState(initial?.gender ?? "dont_indicate");
  const [avatar, setAvatar] = useState<{ uri: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name || ""); setBio(initial.bio || "");
      setAge(initial.age?.toString() ?? ""); setHours(initial.hours_in_game?.toString() ?? "");
      setCity(initial.city || ""); setCountry(initial.country || "");
      setGame(initial.game || "dota2"); setGender(initial.gender || "dont_indicate");
    }
  }, [initial]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setAvatar({ uri: result.assets[0].uri });
  };

  const onSave = async () => {
    setSaving(true); setMessage(null);
    try {
      const card = await saveProfile(userId, {
        first_name: firstName.trim(), bio: bio.trim(),
        age: age ? parseInt(age, 10) || null : null,
        hours_in_game: hours ? parseInt(hours, 10) || null : null,
        city: city.trim(), country, game, gender, avatar,
      });
      onSaved(card); setAvatar(null);
      setMessage({ text: "Профиль сохранён", isError: false });
    } catch (e: any) {
      const errData = e?.response?.data;
      let msg = "Ошибка сохранения";
      if (errData) {
        if (typeof errData === "string") msg = errData;
        else if (errData.detail) msg = errData.detail;
        else { const vals = Object.values(errData).flat(); msg = vals.filter(Boolean).join(". "); }
      }
      setMessage({ text: msg, isError: true });
    } finally { setSaving(false); }
  };

  const countryLabel = COUNTRIES.find((c) => c.code === country)?.label || country;
  const filteredCountries = COUNTRIES.filter((c) => c.label.toLowerCase().includes(countrySearch.toLowerCase()));

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Pressable onPress={pickImage} style={styles.avatarWrap}>
        {avatar || initial?.avatar_url ? (
          <Image source={{ uri: avatar?.uri || mediaUrl(initial?.avatar_url) || undefined }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={{ fontSize: 36 }}>👤</ThemedText>
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: ACCENT }]}>
          <ThemedText style={{ color: "#fff", fontSize: 16 }}>✎</ThemedText>
        </View>
      </Pressable>

      <Section>
        <Field label="Имя" value={firstName} onChangeText={setFirstName} placeholder="Ваше имя" theme={theme} />
        <Field label="О себе" value={bio} onChangeText={setBio} placeholder="Расскажите о себе" multiline theme={theme} />
      </Section>

      <Section>
        <View style={styles.halfRow}>
          <Field label="Возраст" value={age} onChangeText={setAge} placeholder="0" keyboardType="number-pad" containerStyle={{ flex: 1 }} theme={theme} />
          <Field label="Часы в игре" value={hours} onChangeText={setHours} placeholder="0" keyboardType="number-pad" containerStyle={{ flex: 1 }} theme={theme} />
        </View>
        <Field label="Город" value={city} onChangeText={setCity} placeholder="Ваш город" theme={theme} />
        <View style={{ gap: 6 }}>
          <ThemedText style={styles.fieldLabel}>Страна</ThemedText>
          <Pressable onPress={() => setShowCountryPicker(!showCountryPicker)}
            style={[styles.input, { backgroundColor: theme.backgroundElement, justifyContent: "center", paddingVertical: 14 }]}>
            <ThemedText style={{ opacity: country ? 1 : 0.4 }}>{countryLabel || "Выберите страну"}</ThemedText>
          </Pressable>
          {showCountryPicker && (
            <View style={[styles.picker, { backgroundColor: theme.backgroundElement }]}>
              <TextInput value={countrySearch} onChangeText={setCountrySearch}
                style={[styles.pickerSearch, { color: theme.text, backgroundColor: theme.background }]}
                placeholder="Поиск..." placeholderTextColor={theme.textSecondary} autoFocus />
              <ScrollView style={{ maxHeight: 180 }}>
                {filteredCountries.map((c) => (
                  <Pressable key={c.code} onPress={() => { setCountry(c.code); setCountrySearch(""); setShowCountryPicker(false); }}
                    style={[styles.pickerRow, country === c.code && { backgroundColor: ACCENT + "20" }]}>
                    <ThemedText style={{ fontWeight: country === c.code ? "700" : "400" }}>{c.label}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Section>

      <Section>
        <ThemedText style={styles.blockTitle}>Основная игра</ThemedText>
        <View style={styles.chips}>
          {GAMES.map((g) => (
            <Pressable key={g.code} onPress={() => setGame(g.code)}
              style={[styles.chip, { backgroundColor: game === g.code ? ACCENT : theme.backgroundElement }]}>
              <ThemedText style={{ color: game === g.code ? "#fff" : theme.text, fontWeight: "600", fontSize: 13 }}>{g.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section>
        <ThemedText style={styles.blockTitle}>Пол</ThemedText>
        <View style={styles.chips}>
          {GENDERS.map((g) => (
            <Pressable key={g.code} onPress={() => setGender(g.code)}
              style={[styles.chip, { backgroundColor: gender === g.code ? ACCENT : theme.backgroundElement }]}>
              <ThemedText style={{ color: gender === g.code ? "#fff" : theme.text, fontWeight: "600", fontSize: 13 }}>{g.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Section>

      <Pressable style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={onSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.saveText}>Сохранить</ThemedText>}
      </Pressable>

      {message && (
        <ThemedText style={{ textAlign: "center", marginTop: 8, color: message.isError ? ACCENT : "#4CAF50" }}>
          {message.text}
        </ThemedText>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, containerStyle, theme }: {
  label: string; value: string; onChangeText: (t: string) => void; placeholder?: string;
  multiline?: boolean; keyboardType?: "default" | "number-pad"; containerStyle?: any; theme: any;
}) {
  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput value={value} onChangeText={onChangeText}
        style={[styles.input, multiline && { minHeight: 70, textAlignVertical: "top" }, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        placeholder={placeholder} placeholderTextColor={theme.textSecondary}
        multiline={multiline} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { paddingTop: 8, paddingBottom: 20 },
  avatarWrap: { width: 100, height: 100, borderRadius: 50, position: "relative", alignSelf: "center", marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  editBadge: { position: "absolute", right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  section: { gap: 12, marginBottom: 20 },
  blockTitle: { fontSize: 13, fontWeight: "700", opacity: 0.5, marginLeft: 4, marginBottom: -4 },
  halfRow: { flexDirection: "row", gap: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "600", opacity: 0.6, marginLeft: 4 },
  input: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  saveBtn: {
    backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  picker: { borderRadius: 14, overflow: "hidden" },
  pickerSearch: { borderRadius: 10, margin: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  pickerRow: { paddingHorizontal: 14, paddingVertical: 10 },
});
