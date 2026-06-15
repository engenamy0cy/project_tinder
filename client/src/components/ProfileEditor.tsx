import React, { useEffect, useState } from "react";
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
import { saveProfile, mediaUrl } from "@/lib/api";
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
  const [avatar, setAvatar] = useState<{ uri: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name || "");
      setBio(initial.bio || "");
      setAge(initial.age?.toString() ?? "");
      setHours(initial.hours_in_game?.toString() ?? "");
      setCity(initial.city || "");
      setGame(initial.game || "dota2");
      setGender(initial.gender || "dont_indicate");
    }
  }, [initial]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

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
        avatar,
      });
      onSaved(card);
      setAvatar(null);
      setMessage("Profile saved successfully");
    } catch (e) {
      console.error(e);
      setMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
    >
      <View style={styles.avatarSection}>
        <Pressable onPress={pickImage} style={styles.avatarContainer}>
          {avatar || initial?.avatar_url ? (
            <Image
              source={{ uri: avatar?.uri || mediaUrl(initial?.avatar_url)! }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText style={{ fontSize: 40 }}>👤</ThemedText>
            </View>
          )}
          <View style={styles.editBadge}>
            <ThemedText style={styles.editBadgeText}>✎</ThemedText>
          </View>
        </Pressable>
        <ThemedText themeColor="textSecondary" style={{ marginTop: 8 }}>
          Tap to change avatar
        </ThemedText>
      </View>

      <Field label="First Name">
        <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            placeholder="Your name"
            placeholderTextColor={theme.textSecondary}
        />
      </Field>
      <Field label="About Me">
        <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.multiline, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            multiline
            placeholder="Tell us about yourself..."
            placeholderTextColor={theme.textSecondary}
        />
      </Field>

      <View style={styles.row}>
          <View style={{flex: 1}}>
            <Field label="Age">
                <TextInput value={age} onChangeText={setAge} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} keyboardType="number-pad" placeholder="20" placeholderTextColor={theme.textSecondary} />
            </Field>
          </View>
          <View style={{flex: 1}}>
            <Field label="Hours in game">
                <TextInput value={hours} onChangeText={setHours} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} keyboardType="number-pad" placeholder="1000" placeholderTextColor={theme.textSecondary} />
            </Field>
          </View>
      </View>

      <Field label="City">
        <TextInput value={city} onChangeText={setCity} style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]} placeholder="London" placeholderTextColor={theme.textSecondary} />
      </Field>

      <ThemedText type="smallBold" style={styles.section}>Main Game</ThemedText>
      <View style={styles.chips}>
        {GAMES.map((g) => (
          <Pressable
            key={g.code}
            onPress={() => setGame(g.code)}
            style={[styles.chip, { backgroundColor: game === g.code ? ACCENT : theme.backgroundElement }]}>
            <ThemedText style={[styles.chipText, { color: game === g.code ? "#fff" : theme.text }]}>{g.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="smallBold" style={styles.section}>Gender</ThemedText>
      <View style={styles.chips}>
        {GENDERS.map((g) => (
          <Pressable
            key={g.code}
            onPress={() => setGender(g.code)}
            style={[styles.chip, { backgroundColor: gender === g.code ? ACCENT : theme.backgroundElement }]}>
            <ThemedText style={[styles.chipText, { color: gender === g.code ? "#fff" : theme.text }]}>
              {g.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.saveBtn, saving && styles.saveDisabled]} onPress={onSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.saveText}>Save Profile</ThemedText>}
      </Pressable>

      {message ? (
        <ThemedText style={[styles.message, { color: message.includes("Failed") ? ACCENT : "#4CAF50" }]}>
            {message}
        </ThemedText>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" style={styles.label}>{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: ACCENT,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editBadgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  field: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginLeft: 4,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  section: {
    marginTop: 8,
    marginBottom: 12,
    color: "#888",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
  message: {
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
