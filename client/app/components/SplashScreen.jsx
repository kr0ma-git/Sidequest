import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors, FontSizes, Spacing } from "../constants/theme.js";

export default function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Text style={styles.brand}>SIDEQUEST</Text>
      <ActivityIndicator
        color={Colors.accent}
        size="large"
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  brand: {
    fontSize: FontSizes.xxl,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  spinner: {
    marginTop: Spacing.lg,
  },
});