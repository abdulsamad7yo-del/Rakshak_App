import Geolocation from "react-native-geolocation-service";

export interface LocationCoords {
  lat: number;
  lng: number;
}

export const getCurrentLocation = (): Promise<LocationCoords | null> =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn("Location error:", err);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
