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

// - import the geolocation service library  
// - define a TypeScript interface with `lat` and `lng` fields  
// - create a function `getCurrentLocation` that returns a Promise  
// - inside the Promise, call `Geolocation.getCurrentPosition`  
// - if successful, resolve with latitude and longitude values  
// - if error occurs, log the error and resolve with `null`  
// - configure options: high accuracy enabled, 15s timeout, cached location allowed up to 10s old

