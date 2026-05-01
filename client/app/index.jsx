import { Redirect } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSession } from "./lib/SessionContext.jsx";
import { Colors, FontSizes, Spacing } from "./constants/theme.js";
import SplashScreen from "./components/SplashScreen.jsx";
 
// This is the only file responsible for deciding where the user goes on app open.
// - Still loading session  → show splash screen
// - Session found          → go to job feed
// - No session             → go to login/register
 
export default function Index() {
  const { session, loading } = useSession();
 
  if (loading) return <SplashScreen />;
  if (session) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)" />;

  // Uncomment for debugging the SplashScreen
  // return <SplashScreen />
}