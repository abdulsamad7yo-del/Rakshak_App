// audioService.ts
import AudioRecord from "react-native-audio-record";

export const initAudio = () => {
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: "audio.wav",
  });
};

export const startRecording = () => {
  AudioRecord.start();
};

export const stopRecording = async (): Promise<string> => {
  try {
    const path = await AudioRecord.stop();
    return path;
  } catch (err) {
    console.error("Stop recording error:", err);
    return "";
  }
};
