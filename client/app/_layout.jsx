import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "./lib/SessionContext.jsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
 
// _layout.jsx has one job: wrap the app in providers and render <Slot />.
// All redirect logic lives in app/index.jsx instead.
 
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="light" />
        <Slot />
      </SessionProvider>
    </SafeAreaProvider>
  );
}