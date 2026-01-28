import { LocationCoords } from "./locationService";

const BASE_URL = "https://rakshak-gamma.vercel.app";

export const createSOS = async (userId: string, location: LocationCoords) => {
  try {
    const res = await fetch(`${BASE_URL}/api/sos-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, location, status: "active" }),
    });
    const data = await res.json();
    return data.success ? data.sos.id : null;
  } catch (err) {
    console.error("Create SOS error:", err);
    return null;
  }
};

export const updateSOS = async (id: string, location: LocationCoords, status: string) => {
  try {
    await fetch(`${BASE_URL}/api/sos-alert/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, status }),
    });
  } catch (err) {
    console.error("Update SOS error:", err);
  }
};
