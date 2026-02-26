import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";

const API_URL = "https://rakshak-gamma.vercel.app/api/auth/signin";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FC",
  border: "#E2E8F2",
  accent: "#C0232B",
  accentBright: "#E02E38",
  accentSoft: "#FFF0F1",
  accentMuted: "#FACCCE",
  accentText: "#B01D24",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textDim: "#CBD5E1",
  shadow: "rgba(15,23,42,0.07)",
  white: "#FFFFFF",
};

export default function Login({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password!");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        Alert.alert("Error", result.message || "Login failed");
        return;
      }
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(result.user));
      await AsyncStorage.setItem("codeWord", JSON.stringify(result.user.details.codeWord));
      Alert.alert("Success", "Sign-in successful!");
      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while logging in.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Top decorative band */}
      <View style={styles.topBand}>
        <View style={styles.topBandInner} />
      </View>

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Brand block */}
        <View style={styles.brandBlock}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <Text style={styles.brandTitle}>Rakshak</Text>
          <Text style={styles.tagline}>Your Safety, Our Priority</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Sign In</Text>
          <Text style={styles.cardSub}>Welcome back — stay safe</Text>

          {/* Phone */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={[styles.inputBox, focusedField === "phone" && styles.inputBoxFocused]}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor={C.textDim}
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={[styles.inputBox, focusedField === "pass" && styles.inputBoxFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor={C.textDim}
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("pass")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword
                  ? <EyeSlashIcon size={18} color={C.textMuted} />
                  : <EyeIcon size={18} color={C.textMuted} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
            onPress={handleLogin}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register
          <Pressable onPress={() => navigation.navigate("Register")} style={styles.registerBtn}>
            <Text style={styles.registerBtnText}>Create an Account</Text>
          </Pressable> */}

          <Text style={styles.registerPrompt}>
            Don't have an account?{" "}
            <Text style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
              SignUp here
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  kav: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },

  // Decorative top strip
  topBand: {
    position: "absolute", top: 0, left: 0, right: 0, height: 220,
    backgroundColor: C.accentSoft, overflow: "hidden",
  },
  topBandInner: {
    position: "absolute", top: -60, left: -60, right: -60,
    height: 280, borderRadius: 999,
    backgroundColor: C.accentMuted, opacity: 0.35,
  },

  // Brand block
  brandBlock: {
    alignItems: "center", marginBottom: 28,
  },
  shieldIcon: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: C.accentSoft, borderWidth: 2, borderColor: C.accentMuted,
    justifyContent: "center", alignItems: "center", marginBottom: 12,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  shieldEmoji: { fontSize: 36 },
  brandTitle: {
    fontSize: 40, fontWeight: "800", color: C.accentText,
    letterSpacing: -1, marginBottom: 4,
  },
  tagline: {
    fontSize: 14, color: C.textMuted, fontStyle: "italic", letterSpacing: 0.2,
  },

  // Card
  card: {
    backgroundColor: C.surface, borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 6,
  },
  cardHeading: {
    fontSize: 22, fontWeight: "800", color: C.textPrimary,
    letterSpacing: -0.3, marginBottom: 4,
  },
  cardSub: {
    fontSize: 13, color: C.textMuted, marginBottom: 24,
  },

  // Fields
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12, fontWeight: "700", color: C.textSecondary,
    letterSpacing: 0.4, marginBottom: 7, textTransform: "uppercase",
  },
  inputBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.surfaceAlt, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 12, height: 50,
  },
  inputBoxFocused: {
    borderColor: C.accentBright, backgroundColor: C.accentSoft,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1, fontSize: 15, color: C.textPrimary,
  },
  eyeBtn: { padding: 4, marginLeft: 6 },

  // Login button
  loginBtn: {
    backgroundColor: C.accentBright, height: 52, borderRadius: 14,
    justifyContent: "center", alignItems: "center", marginTop: 8,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 5,
  },
  loginBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  loginBtnText: { color: C.white, fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },

  // Divider
  dividerRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.textMuted, fontWeight: "600" },

  // Register
  registerBtn: {
    height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
    justifyContent: "center", alignItems: "center", backgroundColor: C.surfaceAlt,
    marginBottom: 14,
  },
  registerBtnText: { fontSize: 15, fontWeight: "700", color: C.textSecondary },
  registerPrompt: {
    textAlign: "center", fontSize: 13, color: C.textMuted,
  },
  registerLink: { color: C.accentText, fontWeight: "700" },
});