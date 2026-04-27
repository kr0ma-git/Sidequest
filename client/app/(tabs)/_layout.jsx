import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSizes } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

function TabIcon({ icon, label, focused }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      <Text style={styles.iconEmoji}>{icon}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelFocused]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={30}
                color={focused ? Colors.accent : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myQuests"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
                name={focused ? "list" : "list-outline"}
                size={30}
                color={focused ? Colors.accent : Colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
                name={focused ? "person" : "person-outline"}
                size={30}
                color={focused ? Colors.accent : Colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 10,
  },
  iconWrapFocused: {
    backgroundColor: Colors.accentGlow,
  },
  iconEmoji: {
    fontSize: 80,
  },
  iconLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  iconLabelFocused: {
    color: Colors.accent,
  },
});