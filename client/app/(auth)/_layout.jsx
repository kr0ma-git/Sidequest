import { Stack, Redirect } from "expo-router";
import { useSession } from "../lib/SessionContext.jsx";
import SplashScreen from "../components/SplashScreen.jsx";
 
// This layout guards the auth group.
// If a session already exists (returning user), skip auth entirely and go to tabs.
// This also handles the post-login redirect — since this layout stays mounted,
// it will react when onAuthStateChange fires a new session after login.
 
export default function AuthLayout() {
  const { session, loading } = useSession();
 
  if (loading) return <SplashScreen />;
  if (session) return <Redirect href="/(tabs)" />;
 
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}