import React from "react";
import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from "react-native";
import SOSButton from "../components/Sosbutton";
import Map from "../components/Map";
// import { StyleSheet, Dimensions } from "react-native";

// const { height, width } = Dimensions.get("window");

const { height, width } = Dimensions.get("window");

export default function Home1() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rakshak</Text>
        <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../Images/Picture3.webp")}
          style={styles.bannerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.bannerTitle}>Stay Safe, Stay Secure</Text>
          <Text style={styles.bannerSubtitle}>
            Emergency alerts and safety tips at your fingertips
          </Text>
        </View>
      </View>

      {/* SOS Button */}
      <SOSButton />

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Press the SOS button to alert your emergency contacts instantly.
      </Text>

      {/* Map Section */}
     
      
        <Map />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
   
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E60000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
    color: "#666",
    textAlign: "center",
    width: "85%",
    lineHeight: 20,
  },

  // Banner section
  bannerContainer: {
    width: width - 32,
    height: height * 0.25, // responsive banner height
    borderRadius: 18,
    overflow: "hidden",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "#f2f2f2",
    fontSize: 14,
    marginTop: 4,
  },

  helperText: {
    marginTop: 10,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
    width: "90%",
    marginBottom: 20,
  },
});

