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
/*                         SAFE JSON PARSER                                   */
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

    // Save the photo to a local file first 
    // (VisionCamera returns a temp path that may not be accessible to fetch)
    await RNFS.copyFile(photo.path, dest);

    // what stat do : it gives us the file size, which we can use to check if the photo is too large before uploading.
    // This is important because we have a MAX_TOTAL_SIZE limit of 10 MB for uploads. 
    // If the photo exceeds this limit, we can skip the upload and avoid unnecessary network usage and potential errors from the backend.
    const stats = await RNFS.stat(dest);
    console.log(`📁 Saved locally: ${dest} (${stats.size} bytes)`);

    if (stats.size > MAX_TOTAL_SIZE) {
      console.log("❌ Photo too large, skipping upload.");
      return;
    }

    console.log("⬆ Uploading...");

    // We create a FormData object to send the photo file and associated SOS alert ID to the backend API.
    const form = new FormData();

    // Append the SOS alert ID and the photo file to the form data for upload
    form.append("sosAlertId", sosAlertId);
    form.append("files", {
      uri: "file://" + dest,
      name: filename,
      type: "image/jpeg",
    });
    // why we use "file://" prefix for the URI when appending the photo to the FormData is because React Native's fetch API expects file URIs to be in this format when uploading files.
    // The "file://" prefix indicates that the URI is a local file path, which allows the fetch API to correctly read and upload the file from the device's storage.
    
    
    // why we have not done JSON.stringify(form) is because FormData is a special type of object that is used to construct key/value pairs for form submissions, especially when uploading files.
    // When sending FormData with fetch, we should pass the FormData object directly as the body of the request without stringifying it. 
    // The fetch API will automatically set the correct Content-Type header (including the multipart boundary) and format the request body appropriately for file uploads.
    // backend will get data using request.formData() and it will be able to access the uploaded file and sosAlertId from the form data without any issues.
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

  // loop function that will keep taking photos and uploading them at the specified interval
  //  until `isCapturing` is set to false.
  const loop = async () => {
    while (isCapturing) {
      console.log("🔄 Auto capture iteration...");
      await takePhotoAndUpload(sosAlertId);

      if (!isCapturing) break;

      console.log(`⏳ Waiting ${intervalMs / 1000}s...`);
      await new Promise((res: any) => setTimeout(res, intervalMs));
    }

    console.log("⛔ Auto capture stopped.");
  };

  loop();
}

// function to stop the auto-capture loop by setting the isCapturing flag to false.
// When stopAutoCapture is called, the next time the loop checks the isCapturing flag, it will exit the loop and stop taking photos.
export function stopAutoCapture() {
  console.log("🛑 Stopping auto-capture…");
  isCapturing = false;
}
