import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Layout from "./src/app/Layout";
import { requestAllPermissions } from "./src/utils/permissions";

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    initPermissions();
  }, []);

  const initPermissions = async () => {
    try {
      const granted = await requestAllPermissions();

      if (!granted) {
        Alert.alert(
          "Permissions Required",
          "Some features (voice SOS / location) may not work properly. You can enable permissions from settings."
        );
      }
    } catch (e) {
      console.log("Permission error:", e);
    }
  };

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
