# 🛡️ RAKSHAK - Emergency Safety & SOS Alert App

![React Native](https://img.shields.io/badge/React%20Native-0.83.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Rakshak** is a comprehensive React Native mobile application designed to provide real-time emergency safety features. Users can trigger SOS alerts with real-time location tracking, audio recording, photo capture, and instant SMS notifications to trusted emergency contacts.

---

## 📋 Table of Contents

- [Features](#-features)
- [Working Workflow](#-working-workflow)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Services & APIs](#-services--apis)
- [File Documentation](#-file-documentation)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🚨 Emergency SOS Functionality
- **One-Tap Emergency Alert**: Press SOS button to trigger emergency protocol
- **Real-Time Location Tracking**: Continuous GPS tracking with 40-second update intervals
- **Audio Recording**: Automatic microphone capture (up to 2 minutes)
- **Photo Auto-Capture**: Continuous camera snapshots (up to 120 minutes)
- **Smart Contact Notification**: Automated SMS to trusted emergency contacts with location links
- **Voice Activation**: Trigger SOS with custom code word detection

### 👥 Trusted Contacts Management
- Add/remove emergency contacts from phone contacts
- Customize emergency messages
- Set primary emergency contacts
- One-click contact update

### 🗺️ Location & Navigation
- Real-time map display of current location
- Accuracy radius visualization
- Interactive maps integration (Google Maps)
- Reverse geolocation lookup (place names)

### 🎓 Safety Education
- Multi-category safety tips (Home, Travel, Digital, Workplace)
- Bilingual support (English & Hindi)
- Animated safety tips carousel

### 📊 SOS History & Analytics
- Complete SOS alert history with timestamps
- Media playback (audio & photos)
- Location replay on maps
- Status tracking (active/resolved)

### 🔐 User Authentication
- Phone number + password login
- Email-based registration
- Password reset functionality
- Persistent session management

### 🔔 Notifications
- OneSignal push notifications integration
- SMS alerts to trusted contacts
- In-app notification alerts

---

## 🔄 Working Workflow

### User Journey Flow Chart

```
┌──────────────────────────────────────────────────────────┐
│                   RAKSHAK APP WORKFLOW                    │
└──────────────────────────────────────────────────────────┘

1️⃣  SPLASH SCREEN (SplashScreen.tsx)
    ├─ Check user session
    ├─ Validate login status
    ├─ Fetch fresh user details
    └─ Reverse geolocation lookup

2️⃣  AUTHENTICATION (If Not Logged In)
    ├─ Login Screen → Username + Password
    ├─ Register Screen → Email, Phone, Password
    └─ Forgot Password → Reset Credentials

3️⃣  MAIN APP (Tab Navigation - 4 Tabs)
    ├─ 🏠 HOME → SOS Button + Map + Tips
    ├─ 💡 TIPS → Safety tips carousel
    ├─ 👥 CONTACTS → Trusted contacts manager
    └─ 👤 PROFILE → User settings & history

4️⃣  SOS ACTIVATION WORKFLOW (Most Critical)
    ├─ User Presses SOS Button
    ├─ Step 1: Create SOS Alert
    │         └─ API: POST /api/sos-alert → Get SOS ID
    ├─ Step 2: Start Audio Recording (up to 2 min)
    ├─ Step 3: Initialize Camera (auto-capture photos)
    ├─ Step 4: Get Location (GPS)
    ├─ Step 5: Update Location Every 40 Seconds
    │         └─ API: PUT /api/sos-alert/{id}
    ├─ Step 6: Upload Captured Media
    │         ├─ Audio → /api/media/upload
    │         └─ Photos → /api/media/upload
    └─ Step 7: Notify Trusted Contacts (SMS + Map URL)

5️⃣  VOICE COMMAND (Optional)
    ├─ User Sets Code Word in Profile
    ├─ App Continuously Listens (when not in SOS)
    ├─ Speech-to-Text Conversion
    ├─ Fuzzy Matching with Phonetic Cleaning
    └─ Auto-Trigger SOS When Code Word Detected
```

### SOS Alert Detailed Flow

```
┌────────────────────────────────────────────────┐
│         SOS Alert Workflow (Detailed)           │
└────────────────────────────────────────────────┘

USER PRESSES SOS BUTTON
        ↓
    ┌─────────────────────────────────────┐
    │ 1. INITIALIZE                       │
    ├─────────────────────────────────────┤
    │ • Request permissions               │
    │ • Get current GPS location          │
    │ • Create SOS entry in DB            │
    │ • Store SOS ID locally              │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 2. CAPTURE MEDIA (Parallel)         │
    ├─────────────────────────────────────┤
    │ • Start audio recording (16kHz)     │
    │ • Initialize camera                 │
    │ • Auto-capture photos every N sec   │
    │ • Max file size checks              │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 3. CONTINUOUS TRACKING              │
    ├─────────────────────────────────────┤
    │ • Every 40 seconds:                 │
    │   - Get fresh GPS location          │
    │   - Update SOS alert ({{location}}) │
    │ • Continues until SOS stopped       │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 4. NOTIFY CONTACTS (Immediate)      │
    ├─────────────────────────────────────┤
    │ • Fetch trusted contacts from API   │
    │ • Build SOS message with location   │
    │ • Send SMS to all trusted contacts  │
    │ • Include:                          │
    │   - Google Maps link (coordinates)  │
    │   - SOS alert dashboard link        │
    │   - Custom emergency message        │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 5. UPLOAD MEDIA (When Complete)     │
    ├─────────────────────────────────────┤
    │ • Stop audio recording              │
    │ • Upload audio + photos to server   │
    │ • Associate with SOS ID             │
    │ • Update SOS status to "resolved"   │
    └─────────────────────────────────────┘
        ↓
    SOS COMPLETE - User Safe
```

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      APP.tsx                             │
│                 (Entry Point + Providers)                │
└─────────────────────────────────────────────────────────┘
        │
        ├─ CameraProvider (Global Camera Context)
        ├─ SafeAreaProvider (Notch Handling)
        ├─ NavigationContainer (React Navigation)
        └─ StatusBar Configuration
        
        ↓
        
┌─────────────────────────────────────────────────────────┐
│                    Layout.tsx                            │
│                 (Navigation Router)                      │
└─────────────────────────────────────────────────────────┘
        │
        ├─ StackNavigation.tsx
        │  ├─ Splash Screen (Auth Check)
        │  ├─ Login / Register / Forgot Password
        │  ├─ MainApp (TabNavigation)
        │  └─ SOS History Detail
        │
        └─ TabNavigation.tsx (4 Bottom Tabs)
           ├─ Home Tab (SOS + Map)
           ├─ Tips Tab (Safety Education)
           ├─ Contacts Tab (Emergency Contacts)
           └─ Profile Tab (User Settings)

┌─────────────────────────────────────────────────────────┐
│                    Services Layer                        │
├─────────────────────────────────────────────────────────┤
│ • sosApi.ts ............... SOS CRUD operations         │
│ • locationService.ts ....... GPS/Geolocation           │
│ • audioService.ts .......... Audio recording control    │
│ • audioUploadService.ts .... Upload audio files        │
│ • photoService.ts .......... Camera & photo capture    │
│ • voiceRecognizer.ts ....... Voice command detection   │
│ • notificationService.ts ... SMS & push alerts         │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│              External Services & APIs                    │
├─────────────────────────────────────────────────────────┤
│ Backend:                                                 │
│ • https://rakshak-gamma.vercel.app                      │
│   ├─ /api/auth/signin | /api/auth/signup              │
│   ├─ /api/sos-alert (POST/PUT)                         │
│   ├─ /api/media/upload (POST)                          │
│   └─ /api/user/{id}/details (GET)                      │
│                                                          │
│ Third-Party Services:                                   │
│ • Google Maps API (Maps & geocoding)                    │
│ • Nominatim API (Reverse geolocation)                   │
│ • OneSignal (Push notifications)                        │
│ • Device SMS Service (Android SMS)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend Framework
- **React** `19.2.4` - UI library
- **React Native** `0.83.1` - Mobile framework
- **TypeScript** `5.8.3` - Type safety

### Navigation
- `@react-navigation/native` `7.1.28` - Navigation library
- `@react-navigation/native-stack` `7.11.0` - Stack navigation
- `@react-navigation/bottom-tabs` `7.10.1` - Tab navigation

### Audio/Media
- `react-native-audio-record` `0.2.2` - Audio recording
- `@react-native-community/voice` `1.1.9` - Voice recognition
- `@ascendtis/react-native-voice-to-text` `0.3.2` - Speech-to-text
- `react-native-sound` `0.13.0` - Audio playback
- `react-native-vision-camera` `4.7.3` - Camera access

### Location & Maps
- `react-native-geolocation-service` `5.3.1` - GPS/Location
- `react-native-maps` `1.26.20` - Google Maps integration

### Connectivity & Storage
- `@react-native-async-storage/async-storage` `2.2.0` - Local storage
- `react-native-fs` `2.20.0` - File system
- `react-native-get-sms-android` `2.1.0` - SMS sending (Android)

### Notifications
- `react-native-onesignal` `5.2.16` - Push notifications

### UI/UX
- `react-native-elements` `3.4.3` - UI components
- `react-native-heroicons` `4.0.0` - Icon library
- `react-native-vector-icons` `10.3.0` - Vector icons
- `react-native-svg` `15.15.1` - SVG rendering
- `react-native-safe-area-context` `5.6.2` - Safe area handling
- `react-native-gesture-handler` `2.30.0` - Gesture support
- `react-native-screens` `4.20.0` - Performance optimization

### Development Tools
- **Babel** `7.25.2` - JavaScript compiler
- **Jest** `29.6.3` - Testing framework
- **ESLint** `8.19.0` - Code linting
- **Prettier** `2.8.8` - Code formatting

---

## 📁 Project Structure

```
RakshakAPP/
│
├── 📂 src/                                  ← Main source code
│   ├── 📂 app/                              ← Navigation & routing
│   │   ├── Layout.tsx                       └─ Entry routing
│   │   ├── Stacknavigation.tsx              └─ Auth flow navigation
│   │   ├── Tabnavigation.tsx                └─ Main app tabs
│   │   ├── Home.tsx                         └─ Home tab wrapper
│   │   ├── Profile.tsx                      └─ Profile tab wrapper
│   │   ├── Tips.tsx                         └─ Tips tab wrapper
│   │   └── Trustedcontacts.tsx              └─ Contacts tab wrapper
│   │
│   ├── 📂 screens/                          ← Full-screen components
│   │   ├── SplashScreen.tsx                 └─ Boot screen
│   │   ├── Login.tsx                        └─ User authentication
│   │   ├── Register.tsx                     └─ User registration
│   │   ├── Forgotpassword.tsx               └─ Password recovery
│   │   ├── Home1.tsx                        └─ Main home screen
│   │   ├── Profilescreen.tsx                └─ User profile & settings
│   │   ├── Safetytips.tsx                   └─ Safety tips carousel
│   │   ├── SOSHistoryScreen.tsx             └─ Past SOS alerts
│   │   └── Trustedcontact(export).tsx       └─ Contact management
│   │
│   ├── 📂 components/                       ← Reusable UI components
│   │   ├── Sosbutton.tsx                    └─ SOS activation (CORE)
│   │   ├── GlobalCamera.tsx                 └─ Camera context provider
│   │   ├── Map.tsx                          └─ Map display
│   │   ├── Imageslider.tsx                  └─ Image banner
│   │   └── SendEmergencyButton.tsx          └─ Quick alert button
│   │
│   ├── 📂 services/                         ← Business logic
│   │   ├── sosHandler.ts                    └─ SOS trigger reference
│   │   ├── sosApi.ts                        └─ SOS API calls
│   │   ├── locationService.ts               └─ GPS operations
│   │   ├── audioService.ts                  └─ Audio recording
│   │   ├── audioUploadService.ts            └─ Audio upload
│   │   ├── photoService.ts                  └─ Camera & photos
│   │   ├── voiceRecognizer.ts               └─ Voice detection
│   │   └── notificationService.ts           └─ SMS & notifications
│   │
│   ├── 📂 utils/                            ← Helper functions
│   │   ├── permissions.ts                   └─ Permission requests
│   │   └── constants.ts                     └─ App constants
│   │
│   ├── 📂 assets/
│   │   └── 📂 images/                       └─ Image assets
│   │
│   └── 📂 Images/                           └─ Additional images
│       └── Picture3.webp                    └─ Banner image
│
├── 📂 android/                              ← Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   ├── gradle.properties
│   ├── settings.gradle
│   └── gradlew / gradlew.bat
│
├── 📂 ios/                                  ← iOS native code
│   ├── RakshakAPP/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── Images.xcassets/
│   ├── Podfile
│   └── RakshakAPP.xcodeproj/
│
├── 📂 __tests__/                            ← Unit tests
│   └── App.test.tsx
│
├── 📄 App.tsx                               ← App entry point
├── 📄 index.js                              ← JavaScript entry
├── 📄 app.json                              ← App configuration
├── 📄 package.json                          ← Dependencies
├── 📄 tsconfig.json                         ← TypeScript config
├── 📄 babel.config.js                       ← Babel configuration
├── 📄 metro.config.js                       ← Metro bundler config
├── 📄 jest.config.js                        ← Jest config
├── 📄 Gemfile                               ← iOS Ruby dependencies
└── 📄 README.md                             ← Documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** `>=20.0.0`
- **npm** or **yarn**
- **Android SDK** (for Android development)

### Step 1: Clone Repository

```bash
git clone https://github.com/abdulsamad7yo-del/Rakshak_App
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### Step 3: Install iOS Pods (iOS only)

```bash
cd ios
pod install
cd ..
```

### Step 4:

```
API_BASE_URL=https://rakshak-gamma.vercel.app
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
ONESIGNAL_APP_ID=your_onesignal_app_id
```

### Step 5: Run the Application

**For Android:**
```bash
npm run android
# OR
react-native run-android
```

**For iOS:**
```bash
npm run ios
# OR
react-native run-ios
```

### Step 6: Start Metro Bundler (if not auto-started)

```bash
npm start
# OR
react-native start
```

---

## 🔧 Services & APIs

### Backend API Endpoints

#### Authentication
```
POST /api/auth/signin
  Body: { phoneNumber: string, password: string }
  Response: { success: bool, user: { id, email, phoneNumber, details } }

POST /api/auth/signup
  Body: { email, username, phoneNumber, password }
  Response: { success: bool, message: string }
```

#### SOS Management
```
POST /api/sos-alert
  Body: { userId: string, location: { lat, lng }, status: string }
  Response: { success: bool, sos: { id } }

PUT /api/sos-alert/{sosId}
  Body: { location: { lat, lng }, status: string }
  Response: { success: bool }

GET /api/sos-alert/{sosId}
  Response: { success: bool, sos: { id, timestamp, status, media[] } }
```

#### User Management
```
GET /api/user/{userId}/details
  Response: {
    success: bool,
    details: {
      permanentAddress: { lat, lng },
      codeWord: string,
      message: string,
      trustedFriends: [{ name, phone }]
    }
  }

PUT /api/user/{userId}/update
  Body: { trustedFriends: [], codeWord: string, message: string }
  Response: { success: bool }
```

#### Media Upload
```
POST /api/media/upload
  Body: FormData {
    sosAlertId: string,
    audio: File | photos: File[]
  }
  Response: { success: bool, urls: string[] }
```

### Third-Party Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Google Maps API** | Map display & geocoding | react-native-maps |
| **Nominatim API** | Reverse geolocation | fetch API |
| **OneSignal** | Push notifications | react-native-onesignal |
| **Device SMS** | SMS delivery | react-native-get-sms-android |

---

## 📖 File Documentation

### Core Components

#### **Sosbutton.tsx** (Most Critical)
- **Purpose**: Main SOS emergency button with complete workflow
- **Size**: ~500+ lines
- **Key Features**:
  - Triggers SOS alert creation
  - Manages audio recording (up to 120 seconds)
  - Controls camera for auto-photo capture
  - Continuous GPS location tracking (every 40 seconds)
  - SMS notifications to trusted contacts
  - Automatic media upload
  - Resume functionality if app crashes

#### **voiceRecognizer.ts**
- **Purpose**: Voice command detection with code word
- **Features**:
  - Speech-to-text conversion
  - Fuzzy matching with phonetic cleaning
  - Support for multiple languages (English, Hindi)
  - Automatic SOS trigger on code word detection

#### **notificationService.ts**
- **Purpose**: SMS & push notification handling
- **Features**:
  - Direct SMS sending
  - Message formatting with location links
  - Multi-contact notification
  - Error handling & retry logic

### Service Layers

| Service | Responsibility | Key Functions |
|---------|-----------------|----------------|
| **sosApi.ts** | SOS creation & updates | createSOS, updateSOS |
| **locationService.ts** | GPS operations | getCurrentLocation |
| **audioService.ts** | Audio recording | initAudio, startRecording, stopRecording |
| **photoService.ts** | Camera operations | initCamera, takePhotoAndUpload, startAutoCapture |

---

## 🚀 Getting Started

### Quick Start Guide

1. **Login/Register**
   - Create account or login with credentials
   - Phone number + password required

2. **Setup Emergency Info**
   - Go to Profile tab
   - Set "Code Word" for voice activation
   - Set custom "Emergency Message"
   - Add trusted emergency contacts

3. **Trigger SOS**
   - Press large red SOS button
   - App starts:
     - Audio recording
     - Photo capture
     - Location tracking
     - SMS notifications

4. **Monitor Alert**
   - View real-time map
   - See recording status
   - Check captured photos
   - View contact notifications

5. **Stop SOS**
   - Press SOS button again
   - Media uploads to server
   - Contacts notified completion

---

## 📱 Available Permissions

### Android Permissions Required

```xml
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

<!-- Contacts & SMS -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />

<!-- Media -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
```

---

## 🔐 Security Considerations

### Best Practices Implemented

1. **Authentication**
   - Secure password storage
   - Session tokens in AsyncStorage
   - Password strength validation (8+ chars, special chars required)

2. **Data Protection**
   - Encrypted API communication (HTTPS)
   - Local data stored in AsyncStorage (encrypted on device)
   - Sensitive data cleared on logout

3. **Location Privacy**
   - Location only requested during SOS
   - User can view all location data
   - Option to disable background location

4. **Contact Privacy**
   - Only trusted contacts stored
   - User controls contact list
   - Contacts can be managed anytime

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

---

## 📝 Configuration Files

### **app.json**
```json
{
  "name": "RakshakAPP",
  "displayName": "RakshakAPP"
}
```

### **tsconfig.json**
- Extends React Native TypeScript config
- Target: ES2020
- Module: ESNext

### **babel.config.js**
- React Native preset
- Plugin: @react-native-community/babel-preset

---

## 🐛 Troubleshooting

### Common Issues

**Issue: App crashes on startup**
- Solution: Clear build cache
```bash
npm start -- --reset-cache
```

**Issue: Permissions not requested**
- Solution: Ensure AndroidManifest.xml has permissions
- Check: App Settings → Permissions → Grant required

**Issue: Location not detected**
- Solution: Enable GPS and set location mode to "High Accuracy"
- Test: Use mock location app for testing

**Issue: Audio recording fails**
- Solution: Check microphone permissions
- Test: Use device settings to verify mic works

**Issue: Photos not capturing**
- Solution: Verify camera permissions
- Test: Check available storage space

**Issue: SMS not sending**
- Solution: Android feature only (iOS uses native APIs)
- Verify: SIM card with SMS plan
- Test: Check SMS app is set as default

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [React Native Vision Camera](https://mrousavy.com/react-native-vision-camera/)
- [Google Maps API](https://developers.google.com/maps)

---


## Contact

**Rakshak Development Team**

- **Website**: https://rakshak-gamma.vercel.app
- **Frontend GitHub**:https://github.com/abdulsamad7yo-del/Rakshak_App
- **Backend GitHub**: https://github.com/Samad10jan/rakshak

---

## 🎯 Roadmap

### Planned Features (v2.0)
- [ ] Integration with emergency services (911, Police)
- [ ] Blockchain-based incident verification
- [ ] AI-powered threat detection
- [ ] Wearable device sync (smartwatch alerts)
- [ ] Group safety features
- [ ] Real-time police dispatch integration

### Performance Improvements
- [ ] Reduce app bundle size
- [ ] Optimize battery usage
- [ ] Improve location accuracy
- [ ] Faster media upload

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Dependencies** | 28 |
| **Dev Dependencies** | 16 |
| **Main Screens** | 9 |
| **Components** | 5 |
| **Services** | 8 |
| **API Endpoints** | 15+ |
| **Supported Permissions** | 14 |
| **Supported Languages** | 2 (English, Hindi) |

---

## ✅ Checklist Before Deployment

- [ ] All permissions are properly declared
- [ ] API endpoints are configured correctly
- [ ] OneSignal app ID is set
- [ ] Google Maps API key is valid
- [ ] Environment variables are configured
- [ ] Code passes lint checks
- [ ] All tests pass
- [ ] App tested on real devices
- [ ] Permissions requested correctly
- [ ] No console errors/warnings
- [ ] Loading states work properly
- [ ] Error handling implemented
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] App signed for production

---


