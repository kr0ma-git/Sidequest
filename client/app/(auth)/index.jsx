import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import { supabase } from "../config/supabaseConnection.js";
import { FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSession } from "../lib/SessionContext.jsx";
import SplashScreen from "../components/SplashScreen.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Auth is session-based via Supabase.
// Supabase manages tokens internally — no manual JWT handling needed.
// Need to fix the Login after not redirecting to (tabs)
// ─────────────────────────────────────────────────────────────────────────────

WebBrowser.maybeCompleteAuthSession();

function EyeIcon({ visible }) {
  return (
    <FontAwesome
      name={visible ? "eye-slash" : "eye"}
      size={16}
      color={Colors.textSecondary}
    />
  );
}

function GoogleIcon() {
  return (
    <FontAwesome
      name="google"
      size={16}
      color={Colors.textPrimary}
    />
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: Uncomment when Supabase is set up
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      await new Promise((r) => setTimeout(r, 1200));
      router.replace("/(tabs)");
    } catch (e) {
      setErrors({ email: "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    // TODO: Uncomment when Supabase is set up
    // await supabase.auth.signInWithOAuth({ provider: "google" });
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: "com.sidequest",
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.log("Supabase OAuth Error: ", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    }
  }

  return (
    <View>
      <AuthInput
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <AuthInput
        label="Password"
        placeholder="••••••••"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        rightIcon={<EyeIcon visible={showPassword} />}
        onRightIconPress={() => setShowPassword((s) => !s)}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.forgotWrap}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <AuthButton
        label="Log In"
        onPress={handleLogin}
        loading={loading}
        style={{ marginTop: Spacing.sm }}
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <AuthButton
        label="Google"
        onPress={handleGoogleLogin}
        variant="oauth"
        icon={<GoogleIcon />}
      />
    </View>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Must be at least 8 characters.";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: Uncomment when Supabase is set up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      await new Promise((r) => setTimeout(r, 1200));
      router.replace("/(tabs)");
    } catch (e) {
      setErrors({ email: "An account with this email already exists." });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    // TODO: Uncomment when Supabase is set up
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  return (
    <View>
      <AuthInput
        label="Full Name"
        placeholder="Jane Dela Cruz"
        autoCapitalize="words"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
      />
      <AuthInput
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <AuthInput
        label="Password"
        placeholder="Min. 8 characters"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        rightIcon={<EyeIcon visible={showPassword} />}
        onRightIconPress={() => setShowPassword((s) => !s)}
      />
      <AuthInput
        label="Confirm Password"
        placeholder="••••••••"
        secureTextEntry={!showConfirm}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        rightIcon={<EyeIcon visible={showConfirm} />}
        onRightIconPress={() => setShowConfirm((s) => !s)}
      />

      <AuthButton
        label="Create Account"
        onPress={handleRegister}
        loading={loading}
        style={{ marginTop: Spacing.sm }}
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or sign up with</Text>
        <View style={styles.dividerLine} />
      </View>

      <AuthButton
        label="Google"
        onPress={handleGoogleSignup}
        variant="oauth"
        icon={<GoogleIcon />}
      />

      <Text style={styles.termsText}>
        By creating an account, you agree to our{" "}
        <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
        <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>SIDEQUEST</Text>
            <Text style={styles.tagline}>Your next gig is one quest away.</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            {/* Tab switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("login")}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabLabel, activeTab === "login" && styles.tabLabelActive]}>
                  Log In
                </Text>
                {activeTab === "login" && <View style={styles.tabUnderline} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("register")}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabLabel, activeTab === "register" && styles.tabLabelActive]}>
                  Register
                </Text>
                {activeTab === "register" && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            </View>

            {/* Active form */}
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    justifyContent: "center",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  brand: {
    fontSize: FontSizes.xxl,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  tagline: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },

  // Tabs
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: "center",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  tabLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.accent,
  },

  // Forgot
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -Spacing.xs,
    marginBottom: Spacing.md,
  },
  forgotText: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },

  // Terms
  termsText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.accent,
  },
});