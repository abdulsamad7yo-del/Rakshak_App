import { Alert, Linking } from "react-native";
import { LocationCoords } from "./locationService";

export const notifyTrustedContacts = async (
  friends: { phone: string }[],
  sosId: string,
  location: LocationCoords,
  userMessage?: string
) => {
  const phones = friends.map((x) => x.phone).filter(Boolean);
  if (!phones.length) {
    console.warn("No trusted contacts to notify.");
    return;
  }

  const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  const sosUrl = `http://rakshak-gamma.vercel.app/sos/${sosId}`;

  const message = `
🚨 SOS ALERT 🚨

${userMessage ? `Message: ${userMessage}\n\n` : "I am in danger. Please help immediately.\n\n"}

📍 Location:
${mapUrl}

🔗 SOS Details:
${sosUrl}
  `.trim();

  // ✅ Use requestIdleCallback or fallback to setTimeout
  const runAlert = () => {
    Alert.alert(
      "Send SOS",
      "Send your SOS message:",
      [
        {
          text: "SMS",
          onPress: () => {
            const smsUrl = `sms:${phones.join(",")}?body=${encodeURIComponent(message)}`;
            Linking.openURL(smsUrl).catch((err) => console.warn("SMS failed:", err));
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (typeof (globalThis as any).requestIdleCallback === "function") {
    (globalThis as any).requestIdleCallback(runAlert);
  } else {
    // Fallback for older RN versions / Android
    setTimeout(runAlert, 100);
  }
};
