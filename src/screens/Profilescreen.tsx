import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import SendEmergencyButton from "../components/SendEmergencyButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowRightOnRectangleIcon, PencilIcon, XMarkIcon } from "react-native-heroicons/solid";

// ================= Types ==================
type User = {
  id: string;
  email: string;
  phoneNumber: string;
};

type PermanentAddress = {
  lat: number;
  lng: number;
};

type UserDetails = {
  permanentAddress?: PermanentAddress | null;
  codeWord?: string | null;
  message?: string | null;
};

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  SOSHistory: undefined;
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FC",
  surfaceHover: "#EEF1F8",
  border: "#E2E8F2",
  borderSubtle: "#EDF0F7",

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

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ email }: { email: string }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : "??";
  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Text style={styles.infoIcon}>{icon}</Text>
      </View>
      <View style={styles.infoTextBlock}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "Not available"}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const API_BASE = "https://rakshak-gamma.vercel.app/api/user";

  // ================= Fetch User Details ===================
  useEffect(() => {
    const loadUserAndDetails = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem("loggedInUser");
        if (!userData) { setLoading(false); return; }

        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);

        const res = await fetch(`${API_BASE}/${parsedUser.id}/details`);
        const data = await res.json();

        if (data.success && data.details) {
          setDetails(data.details);
        } else {
          Alert.alert("Error", data.message || "Failed to load user details");
        }

        if (data.details?.permanentAddress) {
          const { lat, lng } = data.details.permanentAddress;
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
          );
          const g = await geo.json();
          if (g?.address) {
            const { city, town, village, state, country } = g.address;
            const place = [city || town || village, state, country].filter(Boolean).join(", ");
            setLocationName(place || "Unknown location");
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
        Alert.alert("Error", "Something went wrong while fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndDetails();
  }, []);

  // ================= Save Updated Details ==================
  const handleSave = async () => {
    if (!user || !details) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${user.id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Details updated successfully!");
        await AsyncStorage.setItem("codeWord", details.codeWord as string);
        const code = await AsyncStorage.getItem("codeWord");
        console.log("code word:", code);
        setEditing(false);
      } else {
        Alert.alert("Error", data.message || "Failed to update details");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  // ================= Logout ==================
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("loggedInUser");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  // ================= Loading ==================
  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <View style={styles.loadingRing}>
          <ActivityIndicator size="large" color={C.accentBright} />
        </View>
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <Text style={styles.errorText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>ACCOUNT</Text>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerBtn, editing && styles.headerBtnActive]}
            onPress={() => setEditing(!editing)}
            activeOpacity={0.75}
          >
            {editing
              ? <XMarkIcon size={18} color={C.accentBright} />
              : <PencilIcon size={18} color={C.textSecondary} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleLogout}
            activeOpacity={0.75}
          >
            <ArrowRightOnRectangleIcon size={18} color={C.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Avatar card ── */}
      <View style={styles.avatarCard}>
        <Avatar email={user.email} />
        <View style={styles.avatarMeta}>
          <Text style={styles.avatarName}>{user.email.split("@")[0]}</Text>
          <View style={styles.avatarBadge}>
            <View style={styles.avatarBadgeDot} />
            <Text style={styles.avatarBadgeText}>Active account</Text>
          </View>
        </View>
      </View>

      {/* ── Static info ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT INFO</Text>
        <View style={styles.card}>
          <InfoRow label="Email" value={user.email} icon="✉️" />
          <View style={styles.cardDivider} />
          <InfoRow label="Phone Number" value={user.phoneNumber} icon="📱" />
          {locationName && (
            <>
              <View style={styles.cardDivider} />
              <InfoRow label="Home Location" value={locationName} icon="📍" />
            </>
          )}
        </View>
      </View>

      {/* ── Emergency settings ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EMERGENCY SETTINGS</Text>
        <View style={styles.card}>

          {/* Code Word */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldIconText}>🔑</Text>
              <Text style={styles.fieldLabel}>Code Word</Text>
              {editing && <View style={styles.editingPill}><Text style={styles.editingPillText}>Editing</Text></View>}
            </View>
            <TextInput
              style={[styles.input, !editing && styles.inputReadOnly]}
              editable={editing}
              placeholder="Enter code word"
              placeholderTextColor={C.textDim}
              value={details?.codeWord ?? ""}
              onChangeText={(text) => setDetails({ ...details, codeWord: text })}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Message */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldIconText}>💬</Text>
              <Text style={styles.fieldLabel}>Emergency Message</Text>
            </View>
            <TextInput
              style={[styles.input, styles.inputMultiline, !editing && styles.inputReadOnly]}
              editable={editing}
              multiline
              placeholder="Enter emergency message"
              placeholderTextColor={C.textDim}
              value={details?.message ?? ""}
              onChangeText={(text) => setDetails({ ...details, message: text })}
            />
          </View>
        </View>
      </View>

      {/* ── Save button ── */}
      {editing && (
        <View style={styles.saveBtnWrapper}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── SOS History ── */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("SOSHistory")}
          activeOpacity={0.82}
        >
          <Text style={styles.historyBtnIcon}>🕑</Text>
          <Text style={styles.historyBtnText}>View SOS History</Text>
          <Text style={styles.historyBtnChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <SendEmergencyButton />
    </ScrollView>
  );
}

// ================= Styles ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: C.bg, gap: 12,
  },

  // Loading / error
  loadingRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.accentSoft, justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: C.accentMuted,
  },
  loadingText: { fontSize: 14, color: C.textMuted, marginTop: 4 },
  errorText: { fontSize: 16, color: C.accentBright, fontWeight: "600" },

  // Header
  header: {
    backgroundColor: C.surface,
    paddingTop: 54, paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    borderBottomWidth: 1, borderBottomColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 4,
  },
  headerEyebrow: {
    fontSize: 10, fontWeight: "800", color: C.accentBright,
    letterSpacing: 2.5, marginBottom: 3,
  },
  headerTitle: {
    fontSize: 28, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.5,
  },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  headerBtnActive: { backgroundColor: C.accentSoft, borderColor: C.accentMuted },

  // Avatar card
  avatarCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    margin: 16, padding: 18,
    backgroundColor: C.surface, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  avatarCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: C.accentSoft, borderWidth: 2, borderColor: C.accentMuted,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: C.accentText },
  avatarMeta: { flex: 1, gap: 6 },
  avatarName: { fontSize: 18, fontWeight: "700", color: C.textPrimary, letterSpacing: -0.2 },
  avatarBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "#A7F3D0",
  },
  avatarBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669" },
  avatarBadgeText: { fontSize: 11, fontWeight: "700", color: "#059669" },

  // Section
  section: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: {
    fontSize: 10, fontWeight: "800", color: C.textMuted,
    letterSpacing: 2, marginBottom: 8, paddingLeft: 2,
  },

  // Card
  card: {
    backgroundColor: C.surface, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardDivider: { height: 1, backgroundColor: C.borderSubtle, marginLeft: 52 },

  // Info row
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  infoIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  infoIcon: { fontSize: 16 },
  infoTextBlock: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 11, fontWeight: "600", color: C.textMuted, letterSpacing: 0.3 },
  infoValue: { fontSize: 15, fontWeight: "600", color: C.textPrimary },

  // Field block
  fieldBlock: { padding: 16 },
  fieldHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  fieldIconText: { fontSize: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: C.textSecondary, flex: 1 },
  editingPill: {
    backgroundColor: C.accentSoft, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: C.accentMuted,
  },
  editingPillText: { fontSize: 10, fontWeight: "700", color: C.accentText, letterSpacing: 0.5 },

  // Input
  input: {
    backgroundColor: C.surfaceAlt,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: C.textPrimary,
    borderWidth: 1.5, borderColor: C.border,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  inputReadOnly: { opacity: 0.65, borderStyle: "dashed" },

  // Save
  saveBtnWrapper: { paddingHorizontal: 16, marginBottom: 12 },
  saveBtn: {
    backgroundColor: C.accentBright, borderRadius: 14,
    paddingVertical: 15, alignItems: "center",
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  saveBtnText: { color: C.white, fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },

  // History
  historyBtn: {
    backgroundColor: C.surface,
    borderRadius: 16, paddingVertical: 15, paddingHorizontal: 18,
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  historyBtnIcon: { fontSize: 18 },
  historyBtnText: { flex: 1, fontSize: 15, fontWeight: "700", color: C.textPrimary },
  historyBtnChevron: { fontSize: 22, color: C.textMuted, fontWeight: "600" },
});