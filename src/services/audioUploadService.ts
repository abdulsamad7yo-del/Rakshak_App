import { Platform } from "react-native";

const BASE_URL = "https://rakshak-gamma.vercel.app";

export const uploadAudio = async (filePath: string, sosId: string) => {
  try {
    const formData = new FormData();
    formData.append("audio", {
      uri: Platform.OS === "android" ? `file://${filePath}` : filePath,
      type: "audio/wav",
      name: "recording.wav",
    } as any);
    formData.append("sosAlertId", sosId);

    const response = await fetch(`${BASE_URL}/api/media/upload`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload failed");

    console.log("Audio uploaded successfully:", result);
    return result;
  } catch (err) {
    console.error("Audio upload error:", err);
    throw err;
  }
};
