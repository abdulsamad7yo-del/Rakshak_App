import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Home1 from "../screens/Home1";

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View>
          <Home1 />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
