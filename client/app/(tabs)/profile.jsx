import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Colors, FontSizes, Spacing } from "../constants/theme";
 
export default function Profile() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  title: { fontSize: FontSizes.xl, fontWeight: "900", color: Colors.textPrimary },
  sub: { fontSize: FontSizes.sm, color: Colors.textMuted },
});