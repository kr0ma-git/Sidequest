import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Colors, FontSizes, Radius, Spacing } from "../constants/theme";

export function AuthButton({
  label,
  onPress,
  loading = false,
  variant = "primary",
  icon,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "ghost" && styles.ghost,
        variant === "oauth" && styles.oauth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.background : Colors.textPrimary}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.label,
              variant === "primary" && styles.labelPrimary,
              variant === "ghost" && styles.labelGhost,
              variant === "oauth" && styles.labelOAuth,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  oauth: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: Colors.background,
  },
  labelGhost: {
    color: Colors.textSecondary,
  },
  labelOAuth: {
    color: Colors.textPrimary,
  },
});