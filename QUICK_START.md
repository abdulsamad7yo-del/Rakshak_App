# 🚀 RAKSHAK Quick Start Guide

## What is Rakshak?
**Emergency safety app** with one-tap SOS alerts, real-time location tracking, voice activation, and instant SMS notifications to trusted contacts.

---

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
# iOS only: cd ios && pod install && cd ..
```

### 2. Configure Environment
Create `.env` file:
```env
API_BASE_URL=https://rakshak-gamma.vercel.app
GOOGLE_MAPS_API_KEY=your_key_here
```

### 3. Run App
```bash
# Android
npm run android

# iOS
npm run ios
```

---

## How Rakshak Works

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         ↓
┌─────────────────────────┐
│  Main App (4 Tabs)      │
├─────────────────────────┤
│ 🏠 Home (+ SOS Button)  │
│ 💡 Safety Tips          │
│ 👥 Emergency Contacts   │
│ 👤 User Profile         │
└────────┬────────────────┘
         ↓
    WHEN SOS PRESSED:
    1️⃣  Start audio recording
    2️⃣  Begin photo capture
    3️⃣  Track GPS location
    4️⃣  Send location SMS
    5️⃣  Upload media
```

---

## Key Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **🚨 SOS Alert** | Press red SOS button on Home tab |
| **🎤 Voice Command** | Say your code word (set in Profile) |
| **📍 Location Sharing** | Automatic when SOS triggered |
| **👥 Emergency Contacts** | Add in Contacts tab |
| **💡 Safety Tips** | View in Tips tab |
| **📊 SOS History** | Check in Profile tab |

---

## Authentication

### Login
```
Email/Phone: Your credentials
Password: 8+ chars with special character
```

### Register
```
Email: user@example.com
Phone: 10-digit number
Password: Min 8 chars + special character
```

---

## Project Structure Summary

```
src/
├── app/              → Navigation & routing
├── screens/          → Full-screen components (9 screens)
├── components/       → Reusable UI parts (5 components)
├── services/         → Business logic (8 services)
└── utils/            → Helper functions
```

---

## Core Services

| Service | Function |
|---------|----------|
| **sosApi.ts** | Create/update SOS alerts |
| **locationService.ts** | Get GPS coordinates |
| **audioService.ts** | Record audio |
| **photoService.ts** | Capture photos |
| **voiceRecognizer.ts** | Detect voice commands |
| **notificationService.ts** | Send SMS alerts |

---

## API Endpoints

```
🔐 Authentication
├─ POST /api/auth/signin
└─ POST /api/auth/signup

🚨 SOS Management
├─ POST /api/sos-alert        (Create)
├─ PUT /api/sos-alert/{id}    (Update)
└─ GET /api/sos-alert/{id}    (Get)

👤 User Data
├─ GET /api/user/{id}/details
└─ PUT /api/user/{id}/update

📸 Media Upload
└─ POST /api/media/upload
```

---

## Important Files

| File | Purpose | Lines |
|------|---------|-------|
| **Sosbutton.tsx** ⭐ | Main SOS logic | 500+ |
| **voiceRecognizer.ts** | Voice detection | 200+ |
| **Tabnavigation.tsx** | Main app navigation | 150+ |
| **Profilescreen.tsx** | User settings | 300+ |
| **SOSHistoryScreen.tsx** | Alert history | 400+ |

---

## Common Commands

```bash
# Start app
npm start

# Android
npm run android

# iOS
npm run ios

# Lint code
npm run lint

# Run tests
npm test

# Format code
npm run format
```

---

## Permissions Required (Android)

✅ Location (Fine, Coarse, Background)
✅ Camera
✅ Microphone (Audio)
✅ Storage (Read/Write)
✅ Contacts
✅ SMS (Send/Receive)

---

## Setup Workflow

1. **Profile Setup**
   - Set code word (for voice activation)
   - Write emergency message
   - Add trusted contacts

2. **Test Location**
   - Grant location permission
   - Verify on map

3. **Test Audio**
   - Grant microphone permission
   - Record a test message

4. **Test SMS**
   - Add a phone number
   - Try SendEmergencyButton

5. **Ready for SOS!**
   - Press SOS button
   - Monitor real-time tracking
   - Check SMS notifications

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | `npm start --reset-cache` |
| No location | Enable GPS, set to "High Accuracy" |
| No audio | Check microphone permission |
| No SMS | Android only, needs SIM card |
| Photos not saving | Check storage space |

---

## Dependencies (Key)

```
React Native            0.83.1
React                   19.2.4
TypeScript              5.8.3
@react-navigation       7.x
react-native-maps       1.26.20
react-native-vision-camera      4.7.3
@ascendtis/react-native-voice-to-text   0.3.2
```

---

## Tech Stack Summary

```
Frontend:    React Native + TypeScript
Navigation:  React Navigation (Stack + Tabs)
Storage:     AsyncStorage (local device)
Maps:        Google Maps API
Camera:      Vision Camera
Audio:       react-native-audio-record
Voice:       Speech-to-text
SMS:         Native Android SMS
```

---

## File Count

- **Screens**: 9
- **Components**: 5
- **Services**: 8
- **Utils**: 2
- **Config Files**: 8

**Total**: ~60 TypeScript/JavaScript files

---

## Data Flow

```
User Presses SOS
        ↓
Create SOS Entry (API)
        ↓
Start Audio + Photos
        ↓
Get GPS Location
        ↓
Every 40 sec: Update Location
        ↓
Fetch Trusted Contacts
        ↓
Send SMS to All Contacts
        ↓
Upload Media Files
        ↓
Stop & Show Summary
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure API endpoint
3. ✅ Run app (`npm run android` or `npm run ios`)
4. ✅ Create account or login
5. ✅ Setup profile
6. ✅ Test SOS button
7. ✅ Add trusted contacts
8. ✅ Set code word for voice

---

## Support

📚 **Full Documentation**: See `README_DETAILED.md`  
🐛 **Issues**: GitHub Issues  
📧 **Contact**: support@rakshak.app  
🆘 **Emergency**: Call local emergency services

---

**Stay Safe! 🛡️**
