import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import ProfilesCard from "@/components/ProfilesCard";
import { ThemedText } from "@/components/themed-text";
import { useUser } from "@/contexts/UserContext";
import { fetchFeed } from "@/lib/api";
import { ACCENT } from "@/lib/config";
import type { ProfileCard } from "@/types/api";

/** Список анкет из ленты поиска (для отладки). */
const ProfilesList = () => {
  const { userId } = useUser();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchFeed(userId)
      .then(setProfiles)
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) {
    return <ThemedText>Войдите в аккаунт</ThemedText>;
  }

  if (loading) {
    return <ActivityIndicator color={ACCENT} />;
  }

  return (
    <View>
      <ThemedText type="subtitle">Лента</ThemedText>
      <FlatList
        data={profiles}
        keyExtractor={(item) => String(item.user_id)}
        renderItem={({ item }) => <ProfilesCard profiles={item} />}
      />
    </View>
  );
};

export default ProfilesList;
