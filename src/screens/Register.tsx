import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  successGreen: "#059669",
  successSoft: "#ECFDF5",
  successBorder: "#A7F3D0",
};

// ─── Field config ─────────────────────────────────────────────────────────────
const FIELDS = [
  { key: "email",       label: "Email",        icon: "✉️",  placeholder: "you@example.com",   keyboardType: "email-address" as const, secure: false, maxLength: undefined },
  { key: "username",    label: "Username",     icon: "👤",  placeholder: "Choose a username", keyboardType: "default" as const,       secure: false, maxLength: undefined },
  { key: "phoneNumber", label: "Phone Number", icon: "📱",  placeholder: "10-digit number",   keyboardType: "phone-pad" as const,     secure: false, maxLength: 10 },
  { key: "password",    label: "Password",     icon: "🔒",  placeholder: "Min 8 chars + symbol", keyboardType: "default" as const,    secure: true,  maxLength: undefined },
];

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const values: Record<string, string> = { email, username, phoneNumber, password };
  const setters: Record<string, (v: string) => void> = {
    email: setEmail, username: setUsername,
    phoneNumber: setPhoneNumber, password: setPassword,
  };

  const url = "https://rakshak-gamma.vercel.app/api/auth/signup";

  // ✅ Client-side Validation (unchanged)
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!email || !username || !phoneNumber || !password) {
      Alert.alert("Error", "All fields are required!"); return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address."); return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Phone", "Phone number must be 10 digits."); return false;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert("Weak Password", "Password must be at least 8 characters long and include at least one special character.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, phoneNumber, password }),
      });
      const data = await response.json();
      console.log("Signup response:", data);
      if (!data.success) {
        Alert.alert("Error", data.message || "Failed to register user!"); return;
      }
      Alert.alert("Success 🎉", data.message || "User registered successfully!");
      navigation.navigate("MainApp", { user: username });
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert("Error", "Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Decorative top band */}
      <View style={styles.topBand}>
        <View style={styles.topBandInner} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand block */}
          <View style={styles.brandBlock}>
            <View style={styles.shieldIcon}>
              <Text style={styles.shieldEmoji}>🛡️</Text>
            </View>
            <Text style={styles.brandTitle}>Rakshak</Text>
            <Text style={styles.tagline}>Create your account to stay safe</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Create Account</Text>
            <Text style={styles.cardSub}>Join Rakshak — it only takes a minute</Text>

            {/* Steps indicator */}
            <View style={styles.stepsRow}>
              {FIELDS.map((f, i) => (
                <View key={f.key} style={styles.stepItem}>
                  <View style={[
                    styles.stepDot,
                    values[f.key].length > 0 && styles.stepDotFilled,
                    focusedField === f.key && styles.stepDotActive,
                  ]}>
                    {values[f.key].length > 0
                      ? <Text style={styles.stepCheck}>✓</Text>
                      : <Text style={styles.stepNum}>{i + 1}</Text>}
                  </View>
                  {i < FIELDS.length - 1 && (
                    <View style={[styles.stepLine, values[f.key].length > 0 && styles.stepLineFilled]} />
                  )}
                </View>
              ))}
            </View>

            {/* Fields */}
            {FIELDS.map((field) => {
              const isFocused = focusedField === field.key;
              const isFilled = values[field.key].length > 0;
              const isPassword = field.key === "password";

              return (
                <View key={field.key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={[
                    styles.inputBox,
                    isFocused && styles.inputBoxFocused,
                    isFilled && !isFocused && styles.inputBoxFilled,
                  ]}>
                    <Text style={styles.inputIcon}>{field.icon}</Text>
                    <TextInput
                      placeholder={field.placeholder}
                      keyboardType={field.keyboardType}
                      secureTextEntry={isPassword && !showPassword}
                      placeholderTextColor={C.textDim}
                      style={[styles.input, isPassword && { flex: 1 }]}
                      value={values[field.key]}
                      onChangeText={setters[field.key]}
                      maxLength={field.maxLength}
                      onFocus={() => setFocusedField(field.key)}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="none"
                    />
                    {isPassword && (
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
                      </TouchableOpacity>
                    )}
                    {isFilled && !isFocused && !isPassword && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Password hint */}
            <View style={styles.hintRow}>
              <Text style={styles.hintText}>
                💡 Min 8 characters with at least one special character (!@#$%…)
              </Text>
            </View>

            {/* Submit */}
            <Pressable
              style={({ pressed }) => [styles.submitBtn, loading && styles.submitBtnLoading, pressed && styles.submitBtnPressed]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading
                ? <Text style={styles.submitBtnText}>Creating account…</Text>
                : <Text style={styles.submitBtnText}>Create Account</Text>
              }
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>already registered?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Back to login */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.82}
            >
              <Text style={styles.loginBtnText}>Sign In Instead</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { alignItems: "center", paddingBottom: 48, paddingHorizontal: 20 },

  // Decorative band
  topBand: {
    position: "absolute", top: 0, left: 0, right: 0, height: 200,
    backgroundColor: C.accentSoft, overflow: "hidden",
  },
  topBandInner: {
    position: "absolute", top: -50, left: -60, right: -60, height: 260,
    borderRadius: 999, backgroundColor: C.accentMuted, opacity: 0.3,
  },

  // Brand
  brandBlock: { alignItems: "center", marginTop: 70, marginBottom: 24 },
  shieldIcon: {
    width: 68, height: 68, borderRadius: 20,
    backgroundColor: C.accentSoft, borderWidth: 2, borderColor: C.accentMuted,
    justifyContent: "center", alignItems: "center", marginBottom: 10,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14, shadowRadius: 12, elevation: 4,
  },
  shieldEmoji: { fontSize: 34 },
  brandTitle: {
    fontSize: 38, fontWeight: "800", color: C.accentText, letterSpacing: -0.8, marginBottom: 4,
  },
  tagline: { fontSize: 13, color: C.textMuted, fontStyle: "italic" },

  // Card
  card: {
    width: "100%", backgroundColor: C.surface, borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 6,
  },
  cardHeading: {
    fontSize: 22, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3, marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: C.textMuted, marginBottom: 20 },

  // Progress steps
  stepsRow: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 24, paddingHorizontal: 8,
  },
  stepItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.surfaceAlt, borderWidth: 1.5, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  stepDotActive: { borderColor: C.accentBright, backgroundColor: C.accentSoft },
  stepDotFilled: { backgroundColor: C.successSoft, borderColor: C.successBorder },
  stepNum: { fontSize: 11, fontWeight: "700", color: C.textMuted },
  stepCheck: { fontSize: 12, fontWeight: "800", color: C.successGreen },
  stepLine: { flex: 1, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  stepLineFilled: { backgroundColor: C.successBorder },

  // Fields
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11, fontWeight: "700", color: C.textSecondary,
    letterSpacing: 0.5, marginBottom: 7, textTransform: "uppercase",
  },
  inputBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.surfaceAlt, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 12, height: 50,
  },
  inputBoxFocused: { borderColor: C.accentBright, backgroundColor: C.accentSoft },
  inputBoxFilled: { borderColor: C.successBorder, backgroundColor: C.successSoft },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: C.textPrimary },
  eyeBtn: { padding: 4, marginLeft: 6 },
  eyeIcon: { fontSize: 16 },
  checkBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.successSoft, borderWidth: 1, borderColor: C.successBorder,
    justifyContent: "center", alignItems: "center", marginLeft: 6,
  },
  checkBadgeText: { fontSize: 11, fontWeight: "800", color: C.successGreen },

  // Hint
  hintRow: {
    backgroundColor: "#FFFBEB", borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: "#FDE68A", marginBottom: 20,
  },
  hintText: { fontSize: 12, color: "#92400E", lineHeight: 18 },

  // Submit
  submitBtn: {
    backgroundColor: C.accentBright, height: 52, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 5,
  },
  submitBtnLoading: { opacity: 0.7 },
  submitBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  submitBtnText: { color: C.white, fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },

  // Divider
  dividerRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 11, color: C.textMuted, fontWeight: "600" },

  // Login link
  loginBtn: {
    height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
    justifyContent: "center", alignItems: "center", backgroundColor: C.surfaceAlt,
  },
  loginBtnText: { fontSize: 15, fontWeight: "700", color: C.textSecondary },
});