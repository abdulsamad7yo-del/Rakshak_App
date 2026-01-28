import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, useColorScheme, View, Text, Alert, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Layout from "./src/app/Layout";
import { requestAllPermissions } from "./src/utils/permissions";

export default function App() {
  const isDarkMode = useColorScheme() === "dark";
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null); // null = loading

  // Request all permissions on app start
  const checkPermissions = async () => {
    try {
      const granted = await requestAllPermissions();
      setPermissionsGranted(granted);

      if (!granted) {
        Alert.alert(
          "Permissions Required",
          "Some features may not work properly. You can grant permissions later from settings."
        );
      }
    } catch (err) {
      console.error("Permission request error:", err);
      setPermissionsGranted(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  if (permissionsGranted === null) {
    // Loading while asking permissions
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Checking permissions...</Text>
      </View>
    );
  }

  if (permissionsGranted === false) {
    // Permissions denied – show retry button
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Some permissions were denied.</Text>
        <Button title="Retry Permissions" onPress={checkPermissions} />
        <Text style={{ marginTop: 10, color: "#666", textAlign: "center" }}>
          The app will work with limited functionality.
        </Text>
      </View>
    );
  }

  // All required permissions granted – render app
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <NavigationContainer>
        <Layout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  text: { textAlign: "center", fontSize: 16 },
});
