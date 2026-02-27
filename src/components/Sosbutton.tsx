import React, { useEffect, useRef, useState } from "react";
import { Animated, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentLocation, LocationCoords } from "../services/locationService";
import { createSOS, updateSOS } from "../services/sosApi";
import { initAudio, startRecording, stopRecording } from "../services/audioService";
import { uploadAudio } from "../services/audioUploadService";
import { requestAudioPermission, requestLocationPermission } from "../utils/permissions";

// Photo capture
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { initCamera, startAutoCapture, stopAutoCapture } from "../services/photoService";
import { notifyTrustedContacts } from "../services/notificationService";
import { initVoiceRecognizer, stopVoiceRecognizer } from "../services/voiceRecognizer";

// import { AUDIO_LIMIT_SEC, LOCATION_LIMIT_SEC } from "../utils/constants";

interface UserData { id: string; }

const AUDIO_LIMIT_SEC = 120
const LOCATION_LIMIT_SEC = 60
const PHOTO_CAPTURE_LIMIT_SEC = 120

export default function SOSButton() {
  // const pulse = useRef(new Animated.Value(1)).current;
  const [isActive, setIsActive] = useState(false);
  const [sosId, setSosId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordTime, setRecordTime] = useState<number>(0);
  const [user, setUser] = useState<UserData | null>(null);

  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera>(null) as React.RefObject<Camera>;

  const sosIdRef = useRef<string | null>(null); // Ref to always hold latest SOS ID
  const isActiveRef = useRef(false);

  // Add this ref alongside your other refs
  const userRef = useRef<UserData | null>(null);

  // Keep it in sync — add this useEffect
  useEffect(() => {
    userRef.current = user;
  }, [user]);


  // ---------------------------- Initialize ----------------------------
  useEffect(() => {
    (async () => {
      console.log("⚡ Initializing SOSButton...");
      const userStr = await AsyncStorage.getItem("loggedInUser");
      if (userStr) setUser(JSON.parse(userStr));
      await initVoiceRecognizer(handleSOS);
      // Initialize audio safely
      console.log("🎤 Initializing Audio Service...");
      await initAudio();

      // Restore previous SOS
      const savedSOS = await AsyncStorage.getItem("activeSOS");

      if (savedSOS) {
        const data = JSON.parse(savedSOS);
        if (data.id) {
          console.log("🔄 Restoring previous SOS:", data.id);
          setSosId(data.id);
          isActiveRef.current = true;
          setIsActive(true);

          await startAudio(data.id); // start recording immediately
          startLocationInterval(data.id); // resume location updates

          // // Code Word Init
          // await initVoiceRecognizer(() => handleSOS());

          // Initialize camera & start auto-capture
          console.log("📸 Initializing Camera for auto-capture...");
          await initCamera(cameraRef);
          startAutoCapture(data.id);
        }
      }
    })();


  }, []);

  useEffect(() => {
    sosIdRef.current = sosId; // update ref whenever sosId state changes
  }, [sosId]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  //------------------------------------Trusted Contacts--------------------------------------------

  const fetchTrustedContactsAndMessage = async (userId: string) => {
    try {
      const res = await fetch(`https://rakshak-gamma.vercel.app/api/user/${userId}/details`);
      const data = await res.json();
      if (data.success && data.details) {
        return {
          friends: data.details.trustedFriends || [],
          userMessage: data.details.message || "HELP!!",
        };
      }
      return { friends: [], userMessage: "HELP!!" };
    } catch (error) {
      console.error("Error fetching trusted contacts:", error);
      return { friends: [], userMessage: "HELP!!" };
    }
  };

  // ---------------------------- Audio ----------------------------

  const audioStopped = useRef(false);

  const startAudio = async (currentSOSId: string) => {
    console.log("🎙 Requesting audio permission...");
    if (!(await requestAudioPermission())) {
      console.warn("⚠️ Audio permission denied");
      return;
    }

    console.log("🎙 Starting audio recording...");
    audioStopped.current = false;
    await startRecording();
    setRecordTime(0);

    // Increment record time
    recordInterval.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);

    // Auto-stop after 120 seconds
    setTimeout(() => {
      if (!audioStopped.current) {
        console.log("⏱ 120s reached, stopping audio automatically...");
        stopAudio(currentSOSId);
      }
    }, AUDIO_LIMIT_SEC * 1000); // 120 seconds
  };

  const stopAudio = async (currentSOSId: string) => {
    if (audioStopped.current) return; // already stopped
    audioStopped.current = true;

    if (recordInterval.current) clearInterval(recordInterval.current);

    console.log("🛑 Stopping audio recording...");
    const path = await stopRecording();
    console.log("📂 Audio file path:", path);
    console.log("🆔 SOS ID for upload:", currentSOSId);

    if (path && currentSOSId) {
      try {
        console.log("⬆️ Uploading audio...");
        await uploadAudio(path, currentSOSId);
        console.log("✅ Audio uploaded successfully");
      } catch (err) {
        console.error("❌ Audio upload failed:", err);
      }
    }
  };


  const startLocationInterval = (id: string) => {
    console.log("📍 Starting location updates...");
    locationInterval.current = setInterval(async () => {
      const location = await getCurrentLocation();
      if (location && id) await updateSOS(id, location, "active");
    }, LOCATION_LIMIT_SEC * 1000);
  };

  const stopLocationInterval = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
      console.log("📍 Location updates stopped");
    }
  };

  // // ---------------------------- Handle SOS ----------------------------
  // const handleSOS = async () => {
  //   if (isProcessing) return;

  //   if (!user) {
  //     console.log("❌ User not ready yet");
  //     return;
  //   }

  //   setIsProcessing(true);

  //   // Update UI instantly
  //   setTimeout(async () => {
  //     try {
  //       if (!isActiveRef.current) {

  //         console.log("🆘 Activating SOS...");

  //         if (!(await requestLocationPermission())) {
  //           Alert.alert("Error", "Location permission denied");
  //           return;
  //         }

  //         // LOCATION (slow) — run but UI stays responsive
  //         const location = await getCurrentLocation();
  //         if (!location) return Alert.alert("Error", "Could not get location");

  //         // API CALL (slow)
  //         const id = await createSOS(user.id, location);
  //         if (!id) return Alert.alert("Error", "Failed to create SOS");

  //         stopVoiceRecognizer();

  //         setSosId(id);
  //         setIsActive(true);
  //         await AsyncStorage.setItem("activeSOS", JSON.stringify({ id }));

  //         // AUDIO — run in background without blocking UI
  //         setTimeout(() => startAudio(id), 10);

  //         // LOCATION LOOP
  //         startLocationInterval(id);

  //         // CAMERA + AUTO-CAPTURE — run fully async with delay
  //         setTimeout(async () => {
  //           console.log("📸 Init camera async...");
  //           await initCamera(cameraRef);
  //           startAutoCapture(id);
  //         }, 500);

  //         // Alert.alert("Success", "SOS Activated");


  //         // console.log(id);

  //         const { friends, userMessage } = await fetchTrustedContactsAndMessage(user.id);
  //         await notifyTrustedContacts(friends, id as string, location, userMessage);


  //       } else {

  //         console.log("Deactivating SOS...");

  //         const location = await getCurrentLocation();
  //         if (location && sosId) updateSOS(sosId, location, "inactive");

  //         // STOP audio async
  //         setTimeout(() => stopAudio(sosId as string), 10);
  //         // await stopAudio();


  //         stopLocationInterval();

  //         // STOP camera async
  //         stopAutoCapture();

  //         isActiveRef.current = false;
  //         setIsActive(false);
  //         setSosId(null);
  //         await AsyncStorage.removeItem("activeSOS");

  //         Alert.alert("Success", "SOS Deactivated");
  //         // initVoiceRecognizer(handleSOS);

  //         // give native voice engine time to reset
  //         setTimeout(() => initVoiceRecognizer(handleSOS), 500);

  //       }
  //     } catch (err) {
  //       console.error("❌ SOS error:", err);
  //       Alert.alert("Error", "Something went wrong");
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   }, 0); // Push heavy work off UI thread immediately
  // };

  const handleSOS = async () => {
    if (isProcessing) return;

    const currentUser = userRef.current; // ← always fresh, no stale closure
    if (!currentUser) {
      console.log("❌ User not ready yet");
      return;
    }

    setIsProcessing(true);

    try {
      if (!isActiveRef.current) {
        console.log("🆘 Activating SOS...");

        if (!(await requestLocationPermission())) {
          Alert.alert("Error", "Location permission denied");
          return;
        }

        const location = await getCurrentLocation();
        if (!location) {
          Alert.alert("Error", "Could not get location");
          return;
        }

        const id = await createSOS(currentUser.id, location); // ← currentUser
        if (!id) {
          Alert.alert("Error", "Failed to create SOS");
          return;
        }

        stopVoiceRecognizer();
        setSosId(id);
        setIsActive(true);
        isActiveRef.current = true;
        await AsyncStorage.setItem("activeSOS", JSON.stringify({ id }));

        setTimeout(() => startAudio(id), 10);
        startLocationInterval(id);
        setTimeout(async () => {
          console.log("📸 Init camera async...");
          await initCamera(cameraRef);
          startAutoCapture(id);
        }, 500);

        fetchTrustedContactsAndMessage(currentUser.id).then(({ friends, userMessage }) => // ← currentUser
          notifyTrustedContacts(friends, id, location, userMessage)
        );

      } else {
        console.log("Deactivating SOS...");

        const currentSosId = sosIdRef.current;
        const location = await getCurrentLocation();
        if (location && currentSosId) updateSOS(currentSosId, location, "inactive");

        setTimeout(() => stopAudio(currentSosId as string), 10);
        stopLocationInterval();
        stopAutoCapture();

        isActiveRef.current = false;
        setIsActive(false);
        setSosId(null);
        await AsyncStorage.removeItem("activeSOS");

        Alert.alert("Success", "SOS Deactivated");
        setTimeout(() => initVoiceRecognizer(handleSOS), 500);
      }
    } catch (err) {
      console.error("❌ SOS error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };


  // ---------------------------- Render ----------------------------
  return (
    <View style={[styles.container]}>
      {/* Hidden camera for auto capture */}
      {device && <Camera ref={cameraRef} style={{ width: 0, height: 0 }} isActive={true} photo={true} device={device} />}

      <TouchableOpacity
        disabled={isProcessing}
        style={[styles.btn, { backgroundColor: isActive ? "#666" : "#D00000" }]}
        onPress={handleSOS}
      >
        <Text style={styles.txt}>{isProcessing ? "..." : isActive ? "STOP" : "SOS"}</Text>
      </TouchableOpacity>

      {isActive && <Text style={{ marginTop: 10 }}>Capturing Started</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center", marginBottom: 20 },
  btn: { height: 140, width: 140, borderRadius: 100, justifyContent: "center", alignItems: "center", elevation: 10 },
  txt: { fontSize: 34, fontWeight: "bold", color: "#fff" },
});
