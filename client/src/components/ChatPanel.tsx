import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { fetchMessages, sendMessage } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { ChatMessage, MatchItem } from "@/types/api";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  visible: boolean;
  match: MatchItem | null;
  userId: number;
  onClose: () => void;
};

export function ChatPanel({ visible, match, userId, onClose }: Props) {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!match || !match.match_id) return;
    setLoading(true);
    try {
      const rows = await fetchMessages(match.match_id, userId);
      setMessages(rows);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [match, userId]);

  useEffect(() => {
    if (visible && match) load();
  }, [visible, match, load]);

  const onSend = async () => {
    if (!match || !text.trim()) return;
    setSending(true);
    try {
      await sendMessage(userId, match.user_id, text.trim());
      setText("");
      await load();
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <ThemedText type="linkPrimary">← Назад</ThemedText>
          </Pressable>
          <ThemedText type="smallBold">{match?.display_name ?? "Чат"}</ThemedText>
          <View style={{ width: 60 }} />
        </View>

        {loading ? (
          <ActivityIndicator style={styles.center} color={ACCENT} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.mine ? styles.mine : styles.theirs,
                  {
                    backgroundColor: item.mine ? ACCENT : theme.backgroundElement,
                  },
                ]}>
                <ThemedText style={{ color: item.mine ? "#fff" : theme.text }}>
                  {item.text}
                </ThemedText>
              </View>
            )}
            ListEmptyComponent={
              <ThemedText themeColor="textSecondary" style={styles.center}>
                Нет сообщений. Напишите первым!
              </ThemedText>
            }
          />
        )}

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Сообщение..."
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.backgroundElement },
            ]}
          />
          <Pressable
            style={[styles.send, sending && { opacity: 0.6 }]}
            onPress={onSend}
            disabled={sending}>
            <ThemedText style={styles.sendText}>Отпр.</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  mine: {
    alignSelf: "flex-end",
  },
  theirs: {
    alignSelf: "flex-start",
  },
  center: {
    textAlign: "center",
    marginTop: 24,
  },
  composer: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  send: {
    backgroundColor: ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});
