import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 56 + bottomPadding, paddingBottom: bottomPadding, paddingTop: 6 } }}>
    <Tabs.Screen name="index" options={{ title: "Measure", tabBarIcon: ({ color }) => <IconSymbol name="camera.fill" size={22} color={color} /> }} />
    <Tabs.Screen name="guide" options={{ title: "Guide", tabBarIcon: ({ color }) => <IconSymbol name="paperplane.fill" size={22} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <IconSymbol name="chevron.left.forwardslash.chevron.right" size={22} color={color} /> }} />
    <Tabs.Screen name="history" options={{ title: "History", tabBarIcon: ({ color }) => <IconSymbol name="chevron.right" size={22} color={color} /> }} />
  </Tabs>;
}
