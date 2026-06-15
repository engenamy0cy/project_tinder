import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { API_BASE_URL } from "@/lib/config";
import type { UserDto } from "@/types/api";

/** Список пользователей (админ-просмотр). slug игнорируется — всегда /users/user/ */
const InfoPageList = ({ slug: _slug }: { slug: string }) => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<UserDto[]>(`${API_BASE_URL}/users/user/`)
      .then((r) => setUsers(r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <ThemedText>Загрузка...</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
          <ThemedText type="smallBold">{item.username}</ThemedText>
          <ThemedText themeColor="textSecondary">{item.email}</ThemedText>
          <ThemedText type="small">
            {item.is_online_flag ? "В сети" : "Не в сети"}
          </ThemedText>
        </View>
      )}
    />
  );
};

export default InfoPageList;
