import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const url = "https://rakshak-gamma.vercel.app/api/auth/signup";

  // ✅ Client-side Validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!email || !username || !phoneNumber || !password) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Phone", "Phone number must be 10 digits.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long and include at least one special character."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, phoneNumber, password }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (!data.success) {
        Alert.alert("Error", data.message || "Failed to register user!");
        return;
      }

      Alert.alert("Success 🎉", data.message || "User registered successfully!");
      navigation.navigate("MainApp", { user: username });
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert("Error", "Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={styles.form}>
          <Text style={styles.head}>Sign Up</Text>

          <Text style={styles.text}>Email:</Text>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.placeholder}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.text}>Username:</Text>
          <TextInput
            placeholder="Username"
            style={styles.placeholder}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.text}>Phone No.:</Text>
          <TextInput
            placeholder="10-digit number"
            keyboardType="phone-pad"
            style={styles.placeholder}
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.text}>Password:</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.placeholder}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.submit, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.texts}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FCFF" },
  form: {
    marginTop: 100,
    width: 325,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#FF0000",
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  head: { fontSize: 30, fontWeight: "bold", color: "#FF0000" },
  text: { color: "#FF0000", fontSize: 18, marginTop: 10 },
  placeholder: {
    borderColor: "#FF0000",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    height: 40,
    color: "#FF0000",
    paddingLeft: 10,
    marginTop: 5,
  },
  submit: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 40,
    width: 200,
    borderRadius: 20,
  },
  texts: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});