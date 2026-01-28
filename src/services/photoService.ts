// src/services/photoService.ts
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { Camera } from "react-native-vision-camera";
import RNFS from "react-native-fs";

const PHOTO_DIR = RNFS.DocumentDirectoryPath + "/sosphotos";
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB
const API_URL = "https://rakshak-gamma.vercel.app/api/media/upload";

let cameraRef: React.RefObject<Camera> | null = null;
let isCapturing = false;

export async function initCamera(ref: React.RefObject<Camera>) {
  console.log("📷 Initializing camera...");
  cameraRef = ref;

  const cameraPermission = await Camera.requestCameraPermission();
  console.log("✅ Camera permission:", cameraPermission);

  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }

  if (!(await RNFS.exists(PHOTO_DIR))) {
    console.log("📂 Creating photo directory:", PHOTO_DIR);
    await RNFS.mkdir(PHOTO_DIR);
  }
}

/* -------------------------------------------------------------------------- */
/*                         SAFE JSON PARSER (IMPORTANT)                        */
/* -------------------------------------------------------------------------- */
function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("❌ JSON PARSE FAILED. RAW RESPONSE:");
    console.log(text);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                              TAKE + UPLOAD PHOTO                            */
/* -------------------------------------------------------------------------- */
export async function takePhotoAndUpload(sosAlertId: string) {
  if (!cameraRef?.current) {
    console.log("⚠️ No camera reference found!");
    return;
  }

  try {
    console.log("📸 Taking photo...");
    const photo = await cameraRef.current.takePhoto({ flash: "off" });

    const filename = `photo_${Date.now()}.jpg`;
    const dest = `${PHOTO_DIR}/${filename}`;

    await RNFS.copyFile(photo.path, dest);

    const stats = await RNFS.stat(dest);
    console.log(`📁 Saved locally: ${dest} (${stats.size} bytes)`);

    if (stats.size > MAX_TOTAL_SIZE) {
      console.log("❌ Photo too large, skipping upload.");
      return;
    }

    console.log("⬆ Uploading...");
    const form = new FormData();
    form.append("sosAlertId", sosAlertId);
    form.append("files", {
      uri: "file://" + dest,
      name: filename,
      type: "image/jpeg",
    });

    const response = await fetch(API_URL, { method: "POST", body: form });

    const raw = await response.text();
    console.log("🔵 Raw Upload Response:", raw);

    const json = safeJsonParse(raw);

    if (!json) {
      console.log("❌ Backend returned non-JSON text. Probably Cloudinary DOWN.");
      return;
    }

    console.log("✅ Parsed Upload JSON:", json);
  } catch (err: any) {
    console.log("❌ Photo capture/upload error:", err);
  }
}

/* -------------------------------------------------------------------------- */
/*                         AUTO CAPTURE (REPEATING LOOP)                      */
/* -------------------------------------------------------------------------- */
export function startAutoCapture(
  sosAlertId: string,
  intervalMs = 2 * 60 * 1000
) {
  if (isCapturing) {
    console.log("⚠️ Auto capture already running.");
    return;
  }

  console.log("▶️ Starting auto-capture...");
  isCapturing = true;

  const loop = async () => {
    while (isCapturing) {
      console.log("🔄 Auto capture iteration...");
      await takePhotoAndUpload(sosAlertId);

      if (!isCapturing) break;

      console.log(`⏳ Waiting ${intervalMs / 1000}s...`);
      await new Promise((res:any) => setTimeout(res, intervalMs));
    }

    console.log("⛔ Auto capture stopped.");
  };

  loop();
}

export function stopAutoCapture() {
  console.log("🛑 Stopping auto-capture…");
  isCapturing = false;
}
