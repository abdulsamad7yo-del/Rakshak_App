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

// - import the audio recording library from `react-native-audio-record`  
// - create `initAudio` function to initialize recording settings 
//   (sample rate, channels, bits per sample, audio source, output file name)  
// - create `startRecording` function that begins audio capture using `AudioRecord.start()`  
// - create `stopRecording` function that stops audio capture asynchronously  
// - inside `stopRecording`, await the file path returned by `AudioRecord.stop()`  
// - if successful, return the path of the saved audio file  
// - if an error occurs, log the error and return an empty string

