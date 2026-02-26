import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Home1 from "../screens/Home1";

export default function Home(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Home1 />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
});