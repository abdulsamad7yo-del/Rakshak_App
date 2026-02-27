// import { Alert, Linking } from "react-native";
// import { LocationCoords } from "./locationService";

// export const notifyTrustedContacts = async (
//   friends: { phone: string }[],
//   sosId: string,
//   location: LocationCoords,
//   userMessage?: string
// ) => {
//   const phones = friends.map((x) => x.phone).filter(Boolean);
//   if (!phones.length) {
//     console.warn("No trusted contacts to notify.");
//     return;
//   }

//   const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
//   const sosUrl = `http://rakshak-gamma.vercel.app/sos/${sosId}`;

//   const message = `
// 🚨 SOS ALERT 🚨

// ${userMessage ? `Message: ${userMessage}\n\n` : "I am in danger. Please help immediately.\n\n"}

// 📍 Location:
// ${mapUrl}

// 🔗 SOS Details:
// ${sosUrl}
//   `.trim();

//   // ✅ Use requestIdleCallback or fallback to setTimeout
//   const runAlert = () => {
//     Alert.alert(
//       "Send SOS",
//       "Send your SOS message:",
//       [
//         {
//           text: "SMS",
//           onPress: () => {
//             const smsUrl = `sms:${phones.join(",")}?body=${encodeURIComponent(message)}`;
//             Linking.openURL(smsUrl).catch((err) => console.warn("SMS failed:", err));
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (typeof (globalThis as any).requestIdleCallback === "function") {
//     (globalThis as any).requestIdleCallback(runAlert);
//   } else {
//     // Fallback for older RN versions / Android
//     setTimeout(runAlert, 100);
//   }
// };

// services/notificationService.ts
import { PermissionsAndroid, Platform } from "react-native";
import { LocationCoords } from "./locationService";

// ─── Permission ───────────────────────────────────────────────────────────────

const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return false;
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: "SMS Permission Required",
        message: "Rakshak needs SMS permission to alert your trusted contacts during an SOS.",
        buttonPositive: "Allow",
        buttonNegative: "Deny",
      }
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error("SMS permission error:", err);
    return false;
  }
};

// ─── Message Builder ──────────────────────────────────────────────────────────

const buildSOSMessage = (
  sosId: string,
  location: LocationCoords,
  userMessage?: string
): string => {
  const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  const sosUrl = `https://rakshak-gamma.vercel.app/sos/${sosId}`;
  const body = userMessage?.trim() || "I am in danger. Please help immediately.";

  return [
    "🚨 SOS ALERT 🚨",
    "",
    body,
    "",
    "📍 Location:",
    mapUrl,
    "",
    "🔗 SOS Details:",
    sosUrl,
  ].join("\n");
};

// ─── Direct SMS (Android only) ────────────────────────────────────────────────

const sendDirectSMS = (phone: string, message: string): Promise<void> =>
  new Promise((resolve) => {
    try {
      // Explicit require — works in both debug and release APK
      const SmsAndroid = require("react-native-get-sms-android");

      // react-native-get-sms-android exports differently depending on version
      const sms = SmsAndroid?.default ?? SmsAndroid;

      if (!sms?.autoSend) {
        console.error("❌ autoSend not found on SmsAndroid module. Check package version.");
        resolve();
        return;
      }

      sms.autoSend(
        phone,
        message,
        (err: string) => { console.warn(`❌ SMS failed → ${phone}:`, err); resolve(); },
        (msg: string) => { console.log(`✅ SMS sent → ${phone}:`, msg); resolve(); }
      );
    } catch (err) {
      console.error("❌ react-native-get-sms-android failed to load:", err);
      resolve();
    }
  });

// ─── Public API ───────────────────────────────────────────────────────────────

export const notifyTrustedContacts = async (
  friends: { phone: string }[],
  sosId: string,
  location: LocationCoords,
  userMessage?: string
): Promise<void> => {
  const phones = friends.map((f) => f.phone).filter(Boolean);

  if (!phones.length) {
    console.warn("⚠️ No trusted contacts to notify.");
    return;
  }

  if (!sosId || !location) {
    console.warn("⚠️ Missing sosId or location — aborting notification.");
    return;
  }

  const message = buildSOSMessage(sosId, location, userMessage);

  if (Platform.OS === "android") {
    const granted = await requestSmsPermission();
    if (!granted) {
      console.warn("⚠️ SEND_SMS permission denied.");
      return;
    }

    await Promise.all(phones.map((phone) => sendDirectSMS(phone, message)));
  } else {
    // iOS: silent SMS not allowed — foreground Linking only
    const { Linking } = await import("react-native");
    const encoded = encodeURIComponent(message);
    Linking.openURL(`sms:${phones[0]}&body=${encoded}`)
      .catch((err) => console.warn("iOS SMS open failed:", err));
  }
};
