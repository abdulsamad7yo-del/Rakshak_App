import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, Platform, PermissionsAndroid, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

export default function LocationMap() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const watchId = useRef<number | null>(null);

  const { height, width } = Dimensions.get("window");

  // Request location permissions
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

  // Start watching location in real-time
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
        distanceFilter: 10, // minimum distance (meters) to trigger update
        interval: 5000,     // Android: update every 5 seconds
        fastestInterval: 2000, // Android: fastest update every 2 seconds
      }
    );
  };

  // Stop watching location (cleanup)
  const stopWatchingLocation = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  useEffect(() => {
    requestLocationPermission();
    return () => stopWatchingLocation(); // cleanup on unmount
  }, []);

  useEffect(() => {
    if (hasLocationPermission) startWatchingLocation();
  }, [hasLocationPermission]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasLocationPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Location permission required.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={requestLocationPermission}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Location not available.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={startWatchingLocation}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 10 }}>MAP VIEW</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: width - 20, height: height / 2 }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {/* User location */}
        <Marker coordinate={location} title="You are here" pinColor="blue" />

        {/* Highlight danger radius */}
        <Circle
          center={location}
          radius={300}
          fillColor="rgba(6, 137, 173, 0.1)"
          strokeColor="rgba(255,0,0,0.3)"
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoBox: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  infoText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
