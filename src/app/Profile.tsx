import React from "react";
import {  View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profilescreen from "../screens/Profilescreen";

export default function Profile() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Profilescreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
