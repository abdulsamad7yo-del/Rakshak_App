// services/cameraContext.tsx
import React, { createContext, useContext, useRef, useState } from "react";
import { Camera, useCameraDevice } from "react-native-vision-camera";

const CameraContext = createContext<{
  cameraRef: React.RefObject<Camera>;
  isCameraActive: boolean;
  setCameraActive: (v: boolean) => void;
} | null>(null);

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const cameraRef = useRef<Camera | null>(null) as React.RefObject<Camera>;
  const [isCameraActive, setCameraActive] = useState(false);
  const device = useCameraDevice("back");

  return (
    <CameraContext.Provider value={{ cameraRef, isCameraActive, setCameraActive }}>
      {children}
      {/* Camera lives HERE — never unmounts with tab changes */}
      {device && <Camera ref={cameraRef} style={{ width: 0, height: 0 }} isActive={isCameraActive} photo={true} device={device}
      // format={format} 
      />}
    </CameraContext.Provider>
  );
}

export const useCameraContext = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error("useCameraContext must be inside CameraProvider");
  return ctx;
};