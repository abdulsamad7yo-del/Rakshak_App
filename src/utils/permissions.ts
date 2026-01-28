import { PermissionsAndroid, Platform } from "react-native";
import { Camera } from "react-native-vision-camera";

export const requestCameraPermission = async (): Promise<boolean> => {
  const status = await Camera.getCameraPermissionStatus();
  if (status === "granted") return true;

  const newStatus = await Camera.requestCameraPermission();
  return newStatus === "granted";
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    const coarse = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    const bg = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
    return (
      fine === PermissionsAndroid.RESULTS.GRANTED &&
      coarse === PermissionsAndroid.RESULTS.GRANTED &&
      bg === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const requestAudioPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    return Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
    ]);
    return Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
    return Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

// Call all permissions together
export const requestAllPermissions = async (): Promise<boolean> => {
  const camera = await requestCameraPermission();
  const location = await requestLocationPermission();
  const audio = await requestAudioPermission();
  const storage = await requestStoragePermission();
  const contacts = await requestContactsPermission();
  const sms = await requestSmsPermission();

  return camera && location && audio && storage && contacts && sms;
};
