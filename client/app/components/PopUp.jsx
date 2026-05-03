import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, FontSizes, Radius, Spacing } from "../constants/theme.js";

export function PopUp({ message, visible, isAlert=false, onClose }) {
    if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Hazard Icon */}
        <View style={styles.iconContainer}>
          {isAlert ? 
            <Text style={styles.icon}>⚠️</Text>
          : 
            <Text style={styles.icon}>✅</Text>
          }
        </View>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  box: {
    width: 280,
    height: 260,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: 5,
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },

  closeText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  iconContainer: {
    marginBottom: 16,
  },

  icon: {
    fontSize: 48,
  },

  message: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
});