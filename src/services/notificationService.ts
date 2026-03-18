import { PermissionsAndroid, Platform } from "react-native";
import { LocationCoords } from "./locationService";

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

// ─── Result type ──────────────────────────────────────────────────────────────

type SMSResult = {
  phone: string;
  success: boolean;
  message: string;
};

// ─── Direct SMS ───────────────────────────────────────────────────────────────

const sendDirectSMS = (phone: string, message: string): Promise<SMSResult> =>
  new Promise((resolve) => {
    try {
      const SmsAndroid = require("react-native-get-sms-android");
      const sms = SmsAndroid?.default ?? SmsAndroid;

      if (!sms?.autoSend) {
        const result = { phone, success: false, message: "autoSend method not found" };
        console.error(` [SMS] ${phone} → ${result.message}`);
        resolve(result);
        return;
      }

      console.log(` [SMS] Attempting to send to ${phone}...`);

      sms.autoSend(
        phone,
        message,
        (err: string) => {
          const result = { phone, success: false, message: err ?? "Unknown error" };
          console.error(` [SMS] FAILED → ${phone} | Reason: ${result.message}`);
          resolve(result);
        },
        (msg: string) => {
          const result = { phone, success: true, message: msg ?? "Sent" };
          console.log(` [SMS] SUCCESS → ${phone} | ${result.message}`);
          resolve(result);
        }
      );

    } catch (err: any) {
      const result = { phone, success: false, message: err?.message ?? "Module load failed" };
      console.error(` [SMS] EXCEPTION → ${phone} | ${result.message}`);
      resolve(result);
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
    console.warn(" [SMS] No trusted contacts to notify.");
    return;
  }

  if (!sosId || !location) {
    console.warn("[SMS] Missing sosId or location — aborting.");
    return;
  }

  console.log(`[SMS] Preparing to notify ${phones.length} contact(s):`, phones);

  const message = buildSOSMessage(sosId, location, userMessage);

  if (Platform.OS === "android") {
    const granted = await requestSmsPermission();
    if (!granted) {
      console.error(" [SMS] SEND_SMS permission denied — no SMS sent.");
      return;
    }

    console.log(" [SMS] Permission granted — sending...");

    const results = await Promise.all(phones.map((phone) => sendDirectSMS(phone, message)));

    // ─── Summary log ───
    const succeeded = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`[SMS] Summary: ${succeeded.length} sent, ${failed.length} failed`);
    succeeded.forEach(r => console.log(`  ${r.phone}`));
    failed.forEach(r => console.error(`   ${r.phone} → ${r.message}`));

  } else {
    const { Linking } = await import("react-native");
    const encoded = encodeURIComponent(message);
    Linking.openURL(`sms:${phones[0]}&body=${encoded}`)
      .catch((err) => console.warn("iOS SMS open failed:", err));
  }
};