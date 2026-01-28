import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SafetyTipsScreen from "../screens/Safetytips";

export default function Tips() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafetyTipsScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
