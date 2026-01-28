import { Linking, Platform } from "react-native";
import { LocationCoords } from "../services/locationService";

interface TrustedContact {
  phone: string;
}

export const openSOSMessageApp = async (
  contacts: TrustedContact[],
  sosId: string,
  location: LocationCoords
) => {
  if (!contacts?.length || !sosId || !location) return;

  // ✅ USE ONLY FIRST NUMBER (CRITICAL)
  const phone = contacts[0]?.phone;
  if (!phone) return;

  const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  const sosUrl = `http://rakshak-gamma.vercel.app/sos/${sosId}`;

  const message = `
🚨 SOS ALERT 🚨

I am in danger. Please help immediately.

📍 Location:
${mapUrl}

🔗 SOS Details:
${sosUrl}
  `.trim();

  const encoded = encodeURIComponent(message);

  // ✅ Correct & reliable SMS deep link
  const url =
    Platform.OS === "ios"
      ? `sms:${phone}&body=${encoded}`
      : `sms:${phone}?body=${encoded}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn("❌ SMS not supported on this device");
      return;
    }

    await Linking.openURL(url);
  } catch (err) {
    console.warn("❌ Failed to open SMS app:", err);
  }
};
