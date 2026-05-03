import { Redirect } from "expo-router";
// This just picks the starting route.
// The actual session checks live in (auth)/_layout.jsx and (tabs)/_layout.jsx —
// they redirect appropriately when the session appears or disappears.
// Default to auth; if the user has a session, (auth)/_layout will redirect to tabs.
 
export default function Index() {
  return <Redirect href="/(auth)" />;
}