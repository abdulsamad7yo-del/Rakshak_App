import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Feather";
import SendEmergencyButton from "../components/SendEmergencyButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowRightOnRectangleIcon, PencilIcon, XMarkIcon } from "react-native-heroicons/solid";
import { ArrowsPointingOutIcon } from "react-native-heroicons/outline";

// ================= Types ==================
type User = {
  id: string;
  email: string;
  phoneNumber: string;
};

type PermanentAddress = {
  lat: number;
  lng: number;
};

type UserDetails = {
  permanentAddress?: PermanentAddress | null;
  codeWord?: string | null;
  message?: string | null;
};

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  SOSHistory: undefined;
};

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const API_BASE = "https://rakshak-gamma.vercel.app/api/user";

  // ================= Fetch User Details ===================
  useEffect(() => {
    const loadUserAndDetails = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem("loggedInUser");

        if (!userData) {
          setLoading(false);
          return;
        }

        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);

        const res = await fetch(`${API_BASE}/${parsedUser.id}/details`);
        const data = await res.json();

        if (data.success && data.details) {
          setDetails(data.details);
        } else {
          Alert.alert("Error", data.message || "Failed to load user details");
        }

        if (data.details?.permanentAddress) {
          const { lat, lng } = data.details.permanentAddress;

          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
          );
          const g = await geo.json();
          if (g?.address) {
            const { city, town, village, state, country } = g.address;
            const place = [city || town || village, state, country]
              .filter(Boolean)
              .join(", ");
            setLocationName(place || "Unknown location");
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
        Alert.alert("Error", "Something went wrong while fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndDetails();
  }, []);

  // ================= Save Updated Details ==================
  const handleSave = async () => {
    if (!user || !details) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${user.id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Details updated successfully!");
        await AsyncStorage.setItem("codeWord", details.codeWord as string);

         const code = await AsyncStorage.getItem('codeWord');
        console.log("code word:",code );
        
        setEditing(false);
      } else {
        Alert.alert("Error", data.message || "Failed to update details");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  // ================= Logout ==================
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("loggedInUser");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  // ================= Screen Views ==================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={{ color: "#FF0000", marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FF0000", fontSize: 18 }}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setEditing(!editing)} style={{ marginRight: 15 }}>
            {editing ? <XMarkIcon size={22} color="white" />
              : <PencilIcon size={22} color="white" />}

          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} >
            <ArrowRightOnRectangleIcon size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email || "Not available"}</Text>

        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{user.phoneNumber || "Not available"}</Text>

        <Text style={styles.label}>Code Word</Text>
        <TextInput
          style={[styles.input, !editing && styles.readOnly]}
          editable={editing}
          placeholder="Enter code word"
          value={details?.codeWord ?? ""}
          onChangeText={(text) => setDetails({ ...details, codeWord: text })}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, !editing && styles.readOnly]}
          editable={editing}
          multiline
          placeholder="Enter emergency message"
          value={details?.message ?? ""}
          onChangeText={(text) => setDetails({ ...details, message: text })}
        />

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate("SOSHistory")}
      >
        <Text style={styles.historyText}>View SOS History</Text>
      </TouchableOpacity>

      <SendEmergencyButton />
    </ScrollView>
  );
}

// ================= Styles ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },

  header: {
    backgroundColor: "#FF0000",
   fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    color: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },

  headerTitle: { fontSize: 20, color: "white", fontWeight: "bold" },

  content: { padding: 20 },

  label: { color: "#888", fontSize: 13, marginTop: 15 },

  value: { color: "#222", fontSize: 16, marginTop: 5 },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },

  readOnly: { opacity: 0.5 },

  saveBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  historyBtn: {
    backgroundColor: "#FF6347",
    borderRadius: 30,
    paddingVertical: 14,
    marginVertical: 10,
    marginHorizontal: 50,
    alignItems: "center",
  },

  historyText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
