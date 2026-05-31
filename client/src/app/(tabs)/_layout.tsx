import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { ACCENT } from "@/lib/config";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundSelected,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Поиск",
          tabBarLabel: "Поиск",
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Матчи",
          tabBarLabel: "Матчи",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarLabel: "Профиль",
        }}
      />
    </Tabs>
  );
}
