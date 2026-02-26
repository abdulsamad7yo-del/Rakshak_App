import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import SOSButton from "../components/Sosbutton";
import Map from "../components/Map";

const { height, width } = Dimensions.get("window");

export default function Home1(): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const bannerScale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(bannerScale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoAccent} />
          <Text style={styles.title}>Rakshak</Text>
          <View style={styles.logoAccent} />
        </View>
        <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
      </Animated.View>

      {/* Banner */}
      <Animated.View
        style={[
          styles.bannerContainer,
          { opacity: fadeAnim, transform: [{ scale: bannerScale }] },
        ]}
      >
        <Image
          source={require("../Images/Picture3.webp")}
          style={styles.bannerImage}
        />
        <View style={styles.overlayTop} />
        <View style={styles.overlay}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>🛡️ LIVE PROTECTION</Text>
          </View>
          <Text style={styles.bannerTitle}>Stay Safe, Stay Secure</Text>
          <Text style={styles.bannerSubtitle}>
            Emergency alerts and safety tips at your fingertips
          </Text>
        </View>
      </Animated.View>

      {/* SOS Section Card */}
      <Animated.View
        style={[
          styles.sosCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.sosLabel}>EMERGENCY</Text>
        <SOSButton />
        <Text style={styles.helperText}>
          Press the SOS button to alert your emergency contacts instantly.
        </Text>
      </Animated.View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Nearby</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Map Section */}
      <View style={styles.mapWrapper}>
        <Map />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 18,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
  },

  // ── Header ──────────────────────────────────────────
  header: {
    alignItems: "center",
    marginBottom: 22,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoAccent: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E60000",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#C10000",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 8,
    color: "#888",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // ── Banner ───────────────────────────────────────────
  bannerContainer: {
    width: width - 36,
    height: height * 0.26,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#C10000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "40%",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 18,
    paddingTop: 24,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  bannerBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E60000",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  // ── SOS Card ─────────────────────────────────────────
  sosCard: {
    width: width - 36,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sosLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#E60000",
    marginBottom: 16,
  },
  helperText: {
    marginTop: 16,
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    lineHeight: 20,
    width: "85%",
  },

  // ── Divider ───────────────────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 36,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#AAA",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ── Map ───────────────────────────────────────────────
  mapWrapper: {
    width: width - 36,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});