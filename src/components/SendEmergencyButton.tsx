import React, { useState } from "react";
import { Alert, Linking, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Geolocation from "react-native-geolocation-service";

export default function SendEmergencyButton() {
  const [isRecording, setIsRecording] = useState(false);

  // Send text SOS
  const sendTextSOS = async () => {
    try {
      Geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const mapsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

        const message = encodeURIComponent(
          `🚨 I need help! This is my current location: ${mapsURL}`
        );

       
          const whatsappURL = `whatsapp://send?text=${message}`;
      const smsURL = `sms:?body=${message}`;
      Alert.alert(
        "Send Emergency Alert",
        "Choose where to send the SOS message:",
        [
          { text: "📱 WhatsApp", onPress: () => Linking.openURL(whatsappURL) },
          { text: "✉️ SMS", onPress: () => Linking.openURL(smsURL) },
          { text: "Cancel", style: "cancel" },
        ]
      );

       
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch your location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );
    

      
    } catch (error) {
      Alert.alert("Error", "Unable to open messaging apps.");
    }
  };

 

  return (
    <View>
      {/* Text SOS button */}
      <TouchableOpacity style={styles.button} onPress={sendTextSOS}>
        <Text style={styles.text}>🚨 Send Emergency Message</Text>
      </TouchableOpacity>

     
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#FF0000",
    marginHorizontal: 50,
    marginVertical:10,
     paddingVertical: 14,
  },
  recording: {
    backgroundColor: "#D32F2F",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
