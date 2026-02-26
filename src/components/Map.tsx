import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

export default function LocationMap() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const watchId = useRef<number | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const { height, width } = Dimensions.get("window");

  // ── Core logic unchanged ──────────────────────────────────────────────────

  const requestLocationPermission = async () => {
    setLoading(true);
    if (Platform.OS === "android") {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location for safety features.",
            buttonPositive: "OK",
          }
        );
        setHasLocationPermission(result === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        setHasLocationPermission(false);
      }
    } else {
      setHasLocationPermission(true);
    }
    setLoading(false);
  };

  const startWatchingLocation = () => {
    if (!hasLocationPermission) return;
    watchId.current = Geolocation.watchPosition(
      (pos: any) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(coords);
      },
      (err) => {
        Alert.alert("Error", "Unable to fetch location: " + err.message);
        setLocation(null);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );
  };

  const stopWatchingLocation = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    return () => stopWatchingLocation();
  }, []);

  useEffect(() => {
    if (hasLocationPermission) startWatchingLocation();
  }, [hasLocationPermission]);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.stateScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0B1120" />
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#3DD6F5" />
          <Text style={styles.stateTitle}>Locating you…</Text>
          <Text style={styles.stateSubtitle}>Requesting GPS access</Text>
        </View>
      </View>
    );
  }

  // ── Permission denied ─────────────────────────────────────────────────────

  if (!hasLocationPermission) {
    return (
      <View style={styles.stateScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0B1120" />
        <View style={styles.stateCard}>
          <Text style={styles.stateIcon}>📍</Text>
          <Text style={styles.stateTitle}>Location Access Needed</Text>
          <Text style={styles.stateSubtitle}>
            Rakshak uses your location to activate safety features and SOS alerts.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestLocationPermission} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Location unavailable ──────────────────────────────────────────────────

  if (!location) {
    return (
      <View style={styles.stateScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0B1120" />
        <View style={styles.stateCard}>
          <Text style={styles.stateIcon}>🛰️</Text>
          <Text style={styles.stateTitle}>Acquiring Signal</Text>
          <Text style={styles.stateSubtitle}>
            Move to an open area for a stronger GPS signal.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={startWatchingLocation} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main map view ─────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>LIVE</Text>
        </View>
        <Text style={styles.headerTitle}>Your Location</Text>
        <TouchableOpacity
          style={styles.recenterBtn}
          onPress={() => mapRef.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 400)}
          activeOpacity={0.7}
        >
          <Text style={styles.recenterIcon}>⊕</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
        >
          <Marker coordinate={location} title="You are here" pinColor="blue" />
          <Circle
            center={location}
            radius={300}
            fillColor="rgba(61, 214, 245, 0.08)"
            strokeColor="rgba(61, 214, 245, 0.35)"
            strokeWidth={1.5}
          />
        </MapView>
      </View>

      {/* Coordinate pill */}
      <View style={styles.coordPill}>
        <Text style={styles.coordLabel}>LAT</Text>
        <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
        <View style={styles.coordDivider} />
        <Text style={styles.coordLabel}>LNG</Text>
        <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const { width, height } = Dimensions.get("window");

const DARK_BG    = "#f8f8f8";
const CARD_BG    = "#ffffff";
const BORDER     = "#1E2D47";
const ACCENT     = "#f54c3d";
const TEXT_PRI   = "#070707";
const TEXT_SEC   = "#111112";

const styles = StyleSheet.create({
  // ── Shared state screens ──
  stateScreen: {
    flex: 1,
    backgroundColor: DARK_BG,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loaderCard: {
    alignItems: "center",
    gap: 12,
  },
  stateCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 32,
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
    
  },
  stateIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRI,
    textAlign: "center",
    marginBottom: 8,
  },
  stateSubtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: DARK_BG,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // ── Map screen ──
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 52,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#22C55E",
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_PRI,
    letterSpacing: 0.2,
  },
  recenterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  recenterIcon: {
    fontSize: 18,
    color: ACCENT,
    lineHeight: 22,
  },

  mapWrapper: {
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  map: {
    width: width - 32,
    height: height * 0.52,
  },

  coordPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_SEC,
    letterSpacing: 1,
  },
  coordValue: {
    fontSize: 13,
    fontWeight: "600",
    color: ACCENT,
    fontVariant: ["tabular-nums"],
  },
  coordDivider: {
    width: 1,
    height: 16,
    backgroundColor: BORDER,
    marginHorizontal: 4,
  },
});