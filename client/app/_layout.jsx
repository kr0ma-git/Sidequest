import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "./lib/SessionContext.jsx";
 
// _layout.jsx has one job: wrap the app in providers and render <Slot />.
// All redirect logic lives in app/index.jsx instead.
 
export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Slot />
    </SessionProvider>
  );
}