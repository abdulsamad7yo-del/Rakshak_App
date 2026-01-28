import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";

const API_URL = "https://rakshak-gamma.vercel.app/api/auth/signin";
const BRAND_COLOR = "#C30000";

export default function Login({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert("Error", result.message || "Login failed");
        return;
      }

      // user store
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(result.user));

      // codeword store
      await AsyncStorage.setItem("codeWord", JSON.stringify(result.user.details.codeWord));
      Alert.alert("Success", "Sign-in successful!");

      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while logging in.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.ibb.co/YWBgMpC/red-gradient-bg.jpg" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.formCard}>
          <Text style={styles.brandTitle}>Rakshak</Text>
          <Text style={styles.tagline}>Your Safety, Our Priority</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#bbb"
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#bbb"
                secureTextEntry={!showPassword}
                style={styles.passwordTextInput}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setShowPassword(!showPassword)}
              >{
                  showPassword ? <EyeSlashIcon size={18} color={BRAND_COLOR} /> :
                    <EyeIcon size={18} color={BRAND_COLOR} />


                }

              </TouchableOpacity>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerPrompt}>
              New user? <Text style={styles.registerLink}>Register here</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 28,
    elevation: 8,
  },
  brandTitle: {
    textAlign: "center",
    fontSize: 38,
    fontWeight: "800",
    color: BRAND_COLOR,
    marginBottom: 4,
  },
  tagline: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginBottom: 32,
    fontStyle: "italic",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: BRAND_COLOR,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  textInput: {
    height: 48,

    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    paddingHorizontal: 14,
    height: 48,
  },
  passwordTextInput: {
    flex: 1,
    color: "#555",
    fontSize: 15,
  },
  visibilityToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loginButton: {
    backgroundColor: BRAND_COLOR,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  loginButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: 24,
    color: "#555",
    fontSize: 14,
  },
  registerLink: {
    color: BRAND_COLOR,
    fontWeight: "700",
  },
});
