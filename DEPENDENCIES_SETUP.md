# 📦 RAKSHAK - Dependencies & Environment Setup

## Prerequisites

```bash
Node.js              ≥ 20.0.0      (Required)
npm                  ≥ 10.0.0      (or yarn)
Android SDK          API 33+       (Android development)
Xcode                14+           (iOS development)
Ruby                 2.7+          (iOS pod installation)
CocoaPods            1.11+         (iOS dependency manager)
```

---

## Project Setup Commands

### 1. Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/Rakshak-React-Native.git
cd Rakshak-React-Native/RakshakAPP

# Install dependencies
npm install

# iOS setup (only if developing for iOS)
cd ios
pod install
cd ..

# Install native dependencies
npm install native-base           # If needed
npm rebuild                       # Rebuild native modules
```

### 2. Verify Installation
```bash
# Check Node
node --version              # v20.x.x
npm --version               # 10.x.x

# Check Android (if installed)
adb --version

# Check Xcode (if installed)
xcode-select --version

# Check CocoaPods (if installed)
pod --version
```

### 3. Run Application
```bash
# Start Metro bundler
npm start
# OR
npx react-native start

# In another terminal, run Android
npm run android
# OR
npx react-native run-android

# In another terminal, run iOS
npm run ios
# OR
npx react-native run-ios
```

---

## Dependency Breakdown

### Production Dependencies (28)

#### Core Framework
```json
{
  "react": "^19.2.4",
  "react-native": "^0.83.1"
}
```
- **Purpose**: Mobile app framework
- **Installation**: `npm install react react-native@0.83.1`
- **Size**: ~50MB (node_modules)

#### Navigation (3 libraries)
```json
{
  "@react-navigation/native": "^7.1.28",
  "@react-navigation/native-stack": "^7.11.0",
  "@react-navigation/bottom-tabs": "^7.10.1"
}
```
- **Purpose**: Screen navigation & routing
- **Install**: `npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs`
- **Peer Dependencies**: react-native-gesture-handler, react-native-reanimated

#### Audio & Media (4 libraries)
```json
{
  "react-native-audio-record": "^0.2.2",
  "@react-native-community/voice": "^1.1.9",
  "@ascendtis/react-native-voice-to-text": "^0.3.2",
  "react-native-sound": "^0.13.0"
}
```
- **Purpose**: Audio recording & voice recognition
- **Install**: `npm install react-native-audio-record @react-native-community/voice @ascendtis/react-native-voice-to-text react-native-sound`
- **Android Permissions**: RECORD_AUDIO, READ_MEDIA_AUDIO

#### Location & Maps (2 libraries)
```json
{
  "react-native-geolocation-service": "^5.3.1",
  "react-native-maps": "^1.26.20"
}
```
- **Purpose**: GPS & map integration
- **Install**: `npm install react-native-geolocation-service react-native-maps`
- **Android Permissions**: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, ACCESS_BACKGROUND_LOCATION
- **iOS Config**: Requires Google Maps API key in Info.plist

#### Camera & Vision (1 library)
```json
{
  "react-native-vision-camera": "^4.7.3"
}
```
- **Purpose**: Camera access for photo capture
- **Install**: `npm install react-native-vision-camera`
- **Android Permissions**: CAMERA, READ_MEDIA_IMAGES
- **Link**: `npx react-native link react-native-vision-camera` (or auto-linked)

#### File System (1 library)
```json
{
  "react-native-fs": "^2.20.0"
}
```
- **Purpose**: File operations (read, write, stat)
- **Install**: `npm install react-native-fs`
- **Android Permissions**: READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE

#### Contacts (1 library)
```json
{
  "react-native-contacts": "^8.0.10"
}
```
- **Purpose**: Access phone contacts for emergency contacts
- **Install**: `npm install react-native-contacts`
- **Android Permissions**: READ_CONTACTS, WRITE_CONTACTS

#### Communication (2 libraries)
```json
{
  "react-native-get-sms-android": "^2.1.0",
  "react-native-onesignal": "^5.2.16"
}
```
- **Purpose**: SMS delivery & push notifications
- **Install**: `npm install react-native-get-sms-android react-native-onesignal`
- **Android Permissions**: SEND_SMS, RECEIVE_SMS, READ_SMS
- **OneSignal**: Requires OneSignal App ID

#### Storage (1 library)
```json
{
  "@react-native-async-storage/async-storage": "^2.2.0"
}
```
- **Purpose**: Local persistent data storage
- **Install**: `npm install @react-native-async-storage/async-storage`
- **No Permissions**: Built-in storage
- **Storage Limit**: ~10MB per app

#### Safe Area & Gestures (3 libraries)
```json
{
  "react-native-safe-area-context": "^5.6.2",
  "react-native-gesture-handler": "^2.30.0",
  "react-native-screens": "^4.20.0"
}
```
- **Purpose**: Handle notches, gestures, performance
- **Install**: `npm install react-native-safe-area-context react-native-gesture-handler react-native-screens`
- **Link**: Auto-linked in modern RN

#### UI Components (3 libraries)
```json
{
  "react-native-elements": "^3.4.3",
  "react-native-heroicons": "^4.0.0",
  "react-native-vector-icons": "^10.3.0",
  "react-native-svg": "^15.15.1"
}
```
- **Purpose**: Pre-built UI components & icons
- **Install**: `npm install react-native-elements react-native-heroicons react-native-vector-icons react-native-svg`
- **Fonts**: Icons may need manual linking on Android

**Total Production Size**: ~200MB (with node_modules)

---

### Development Dependencies (16)

#### TypeScript & Compiler
```json
{
  "typescript": "^5.8.3",
  "@react-native/typescript-config": "0.83.1",
  "@types/react": "^19.2.0",
  "@types/jest": "^29.5.13",
  "@types/react-test-renderer": "^19.1.0"
}
```
- **Purpose**: Static type checking
- **Install**: `npm install --save-dev typescript @react-native/typescript-config @types/react`

#### Babel & Build
```json
{
  "@babel/core": "^7.25.2",
  "@babel/preset-env": "^7.25.3",
  "@babel/runtime": "^7.25.0",
  "@react-native/babel-preset": "0.83.1",
  "@react-native/metro-config": "0.83.1"
}
```
- **Purpose**: Code transpilation & bundling
- **Install**: `npm install --save-dev @babel/core @babel/preset-env @react-native/babel-preset`

#### Testing
```json
{
  "jest": "^29.6.3",
  "react-test-renderer": "19.2.0"
}
```
- **Purpose**: Unit testing framework
- **Install**: `npm install --save-dev jest react-test-renderer`
- **Command**: `npm test`

#### Linting & Formatting
```json
{
  "eslint": "^8.19.0",
  "@react-native/eslint-config": "0.83.1",
  "prettier": "2.8.8"
}
```
- **Purpose**: Code quality & formatting
- **Install**: `npm install --save-dev eslint @react-native/eslint-config prettier`
- **Commands**: 
  - `npm run lint` - Check code
  - `npm run format` - Auto-format

#### CLI & Community Tools
```json
{
  "@react-native-community/cli": "20.0.0",
  "@react-native-community/cli-platform-android": "20.0.0",
  "@react-native-community/cli-platform-ios": "20.0.0"
}
```
- **Purpose**: React Native command-line tools
- **Auto-installed**: With react-native package

---

## Package.json Structure

```json
{
  "name": "RakshakAPP",
  "version": "0.0.1",
  "private": true,
  
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "format": "prettier --write ."
  },
  
  "engines": {
    "node": ">=20"
  },
  
  "dependencies": {
    // ... 28 libraries
  },
  
  "devDependencies": {
    // ... 16 libraries
  }
}
```

---

## Environment Variables

Create `.env` file in root directory:

```env
# API Configuration
API_BASE_URL=https://rakshak-gamma.vercel.app

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_api_key_here

# OneSignal Configuration
ONESIGNAL_APP_ID=your_onesignal_app_id_here

# Nominatim (OpenStreetMap - free geolocation)
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org

# Optional: Feature Flags
ENABLE_VOICE_SOS=true
ENABLE_PHOTO_CAPTURE=true
ENABLE_AUTO_UPDATE=false
```

### Accessing Environment Variables

```typescript
// Option 1: Using react-native-config (add if needed)
import Config from 'react-native-config';
const baseUrl = Config.API_BASE_URL;

// Option 2: Direct import from constants
import { BASE_URL } from './src/utils/constants';
```

---

## Android Setup

### AndroidManifest.xml Permissions

Located: `android/app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

    <!-- Camera -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <!-- Storage -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

    <!-- Contacts & SMS -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <uses-permission android:name="android.permission.READ_SMS" />

    <!-- Internet -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application>
        <!-- Activities and services -->
    </application>
</manifest>
```

### build.gradle Configuration

Located: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.rakshakapp"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "0.0.1"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    // React Native
    implementation 'com.facebook.react:react-native:0.83.1'
    
    // Google Play Services (for Maps & Location)
    implementation 'com.google.android.gms:play-services-maps:18.2.0'
    implementation 'com.google.android.gms:play-services-location:21.0.1'
}
```

### local.properties

```properties
sdk.dir=/Users/username/Library/Android/sdk
ndk.dir=/Users/username/Library/Android/sdk/ndk/21.3.6528147
```

---

## iOS Setup

### Podfile

Located: `ios/Podfile`

```ruby
platform :ios, '13.0'

target 'RakshakAPP' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath]
  )

  # Pods
  pod 'react-native-maps', :subspecs => ['GoogleMaps']
  pod 'GoogleMaps'
  pod 'react-native-vision-camera', :subspecs => ['VisionCamera']
  
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end
end
```

### Info.plist

Add to `ios/RakshakAPP/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Rakshak needs your location for emergency SOS alerts</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Rakshak needs background location access for emergency alerts</string>

<key>NSCameraUsageDescription</key>
<string>Rakshak needs camera access to capture photos during SOS</string>

<key>NSMicrophoneUsageDescription</key>
<string>Rakshak needs microphone access for audio recording during SOS</string>

<key>NSContactsUsageDescription</key>
<string>Rakshak needs access to contacts to add emergency numbers</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Rakshak needs access to your photo library</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location only when you use the app</string>

<key>UIBackgroundModes</key>
<array>
    <string>location</string>
    <string>voip</string>
    <string>newsstand-content</string>
</array>

<!-- Google Maps API Key -->
<key>GoogleMapsAPIKey</key>
<string>YOUR_GOOGLE_MAPS_API_KEY</string>
```

---

## Build & Deploy

### Development Build

```bash
# Android
npm run android

# iOS
npm run ios
```

### Production Build

#### Android
```bash
# Generate release APK
cd android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk

# OR generate AAB (for Play Store)
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab

cd ..
```

#### iOS
```bash
# Build for App Store
cd ios
xcodebuild -workspace RakshakAPP.xcworkspace -scheme RakshakAPP -configuration Release -derivedDataPath build
cd ..

# Or use Xcode GUI
# Select: Product → Scheme → RakshakAPP
# Select: Product → Destination → Generic iOS Device
# Select: Product → Archive
```

---

## Dependency Update Procedure

### Check for Outdated Packages
```bash
npm outdated
```

### Update All Dependencies
```bash
npm update                      # Update to latest compatible
npm install                     # Reinstall node_modules
cd ios && pod update && cd ..   # Update iOS pods
```

### Update Specific Package
```bash
npm install react-native@latest
npm install @react-navigation/native@latest
```

### Audio on Android
```bash
npm install react-native-audio-record
# May need manual linking if RN version < 0.60
npx react-native link react-native-audio-record
```

### Vision Camera Setup
```bash
npm install react-native-vision-camera
# Verify native linking
cd ios && pod install && cd ..
```

---

## Troubleshooting Dependencies

### Issue: "Module not found"
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Pod not found" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: "React Native version mismatch"
```bash
# Check installed version
npm list react-native

# Verify with expected version
cat package.json | grep react-native
```

### Issue: "Java/SDK issues" (Android)
```bash
# Verify Android SDK
$ANDROID_HOME/tools/bin/sdkmanager --list_installed

# Or set manually
export ANDROID_HOME=/Users/username/Library/Android/sdk
```

### Issue: "Build fails on clean install"
```bash
# Full clean rebuild
npm install
npm start -- --reset-cache

# In new terminal
npm run android
# OR
npm run ios
```

---

## Production Checklist

- [ ] Remove console.logs (run linter)
- [ ] All dependencies pinned to versions
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All permissions correctly declared
- [ ] API endpoints configured for production
- [ ] Error handling implemented
- [ ] Performance optimized (bundle size check)
- [ ] Tests passing (if applicable)
- [ ] Code signed for iOS
- [ ] App signed with keystore for Android

### Check Bundle Size
```bash
npm run build:android -- --format=json
npm run build:ios -- --format=json

# Analyze
npm install -g source-map-explorer
source-map-explorer 'bundle.js'
```

---

## Version Reference

| Package | Installed | Status |
|---------|-----------|--------|
| Node | ≥20.0.0 | ✅ Required |
| npm | ≥10.0.0 | ✅ Required |
| React | 19.2.4 | ✅ Current |
| React Native | 0.83.1 | ✅ Current |
| TypeScript | 5.8.3 | ✅ Current |
| @react-navigation | 7.x | ✅ Current |
| Android SDK | API 33+ | ✅ Recommended |
| Xcode | 14+ | ✅ Recommended |

---

**Last Updated: March 2026**
