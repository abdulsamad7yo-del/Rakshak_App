import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  startListening,
  stopListening,
  addEventListener,
} from "@ascendtis/react-native-voice-to-text";
import { PermissionsAndroid, Platform } from "react-native";

let codeWord: string | null = null;
let running = false;
let detecting = false;
let onDetected: (() => void) | null = null;

// subs
let resultSub: any = null;
let endSub: any = null;
let errorSub: any = null;

// ------------------------------------------------

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// ------------------------------------------------

async function requestMicPermission() {
  if (Platform.OS !== "android") return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

// ------------------------------------------------

export async function initVoiceRecognizer(onSOS: () => void) {
  onDetected = onSOS;

  await stopVoiceRecognizer(); // hard reset

  const hasPermission = await requestMicPermission();
  if (!hasPermission) {
    console.log("❌ Mic permission denied");
    return;
  }

  const saved = await AsyncStorage.getItem("codeWord");
  if (!saved) {
    console.log("⚠️ No code word");
    return;
  }

  codeWord = clean(saved);

  console.log("🎧 CodeWord:", codeWord);

  attachListeners();

  detecting = true;
  start();
}

// ------------------------------------------------

async function start() {
  if (running || !detecting) return;

  running = true;

  try {
    await startListening();
    console.log("🎤 Listening...");
  } catch (e) {
    running = false;
    setTimeout(start, 800);
  }
}

// ------------------------------------------------

export async function stopVoiceRecognizer() {
  detecting = false;
  running = false;

  try {
    await stopListening();
  } catch {}

  resultSub?.remove();
  endSub?.remove();
  errorSub?.remove();

  resultSub = null;
  endSub = null;
  errorSub = null;

  console.log("🛑 Voice stopped");
}

// ------------------------------------------------

function attachListeners() {
  resultSub = addEventListener("onSpeechResults", e => {
    let text = "";

    if (Array.isArray(e.value)) text = e.value.join(" ");
    else if (typeof e.value === "string") text = e.value;
    else if (e?.value?.text) text = e.value.text;

    const heard = clean(text);

    console.log("🧠 Heard:", heard);

    if (!codeWord || !detecting) return;

    if (heard.includes(codeWord)) {
      console.log("🚨 CODE WORD DETECTED");

      detecting = false;
      stopVoiceRecognizer();

      onDetected?.();
    }
  });

  endSub = addEventListener("onSpeechEnd", () => {
    running = false;
    if (detecting) setTimeout(start, 300);
  });

  errorSub = addEventListener("onSpeechError", () => {
    running = false;
    if (detecting) setTimeout(start, 500);
  });
}


// **`clean()`** → Formats text (lowercase, removes symbols, trims spaces) to make matching accurate.

// **`requestMicPermission()`** → Requests `RECORD_AUDIO` permission on Android before starting voice recognition.

// **`initVoiceRecognizer()`** → Initializes the system, loads saved code word from `AsyncStorage`, attaches listeners, and starts listening.

// **`start()`** → Starts speech recognition if not already running and detection is enabled (auto-retries on failure).

// **`attachListeners()`** → Adds event listeners for speech results, speech end, and speech errors.

// **`onSpeechResults (inside attachListeners)`** → Extracts spoken text, cleans it, checks for code word, and triggers SOS callback if matched.

// **`onSpeechEnd (inside attachListeners)`** → Restarts listening automatically if detection is still active.

// **`onSpeechError (inside attachListeners)`** → Handles speech errors and retries listening after delay.

// **`stopVoiceRecognizer()`** → Stops listening, removes all listeners, resets flags, and prevents memory leaks.
