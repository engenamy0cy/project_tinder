import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { UserProvider, useUser } from "@/contexts/UserContext";
import { useUdpNotifications } from "@/hooks/use-udp-notifications";

function RootLayoutContent() {
  const scheme = useColorScheme();
  const { userId } = useUser();

  useUdpNotifications(userId);

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootLayoutContent />
      </UserProvider>
    </SafeAreaProvider>
  );
}
