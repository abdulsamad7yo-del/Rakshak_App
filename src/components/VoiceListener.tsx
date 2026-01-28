import React, { useEffect, useRef } from "react";
import Voice from "@react-native-community/voice";
import { Alert } from "react-native";

export default function VoiceListener({ onTriggerSOS }: { onTriggerSOS: () => void }) {
  const isListening = useRef(false);

  const startListening = async () => {
    try {
      if (!isListening.current) {
        isListening.current = true;
        await Voice.start("en-US");
      }
    } catch (e) {
      console.log("Voice start error:", e);
      isListening.current = false;
    }
  };

  const stopListening = () => {
    try {
      Voice.stop();
      isListening.current = false;
    } catch (_) {}
  };

  const onSpeechResults = (event: any) => {
    const text = event.value?.[0]?.toLowerCase() || "";
    console.log("Heard:", text);

    if (text.includes("save me")) {
      onTriggerSOS(); // triggers your SOS
      Alert.alert("SOS Triggered by Voice!");
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (e) => {
      console.log("Speech error:", e);
      isListening.current = false;
      setTimeout(startListening, 500);
    };

    startListening();

    return () => {
      stopListening();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return null;
}
