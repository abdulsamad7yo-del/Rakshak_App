# 🛡️ RAKSHAK - Emergency Safety & SOS Alert App

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.83.1-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?logo=android&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D20-green?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative&logoColor=white)

**Rakshak** — *Your Safety, Our Priority* 🚨

A comprehensive React Native mobile application providing real-time emergency safety features with one-tap SOS alerts, real-time location tracking, voice activation, and instant SMS notifications to trusted emergency contacts.

[🚀 Quick Start](#quick-start) • [📚 Documentation](#documentation) • [✨ Features](#features) • [🏗️ Architecture](#architecture)

</div>

---

## ✨ Features

### 🚨 Emergency SOS System
- **One-Tap SOS**: Press the big red button to trigger emergency protocol
- **Real-Time Location Tracking**: Continuous GPS updates every 40 seconds
- **Audio Recording**: Automatic microphone capture (up to 2 minutes)
- **Photo Auto-Capture**: Continuous camera snapshots during emergency
- **Automated SMS Alerts**: Instant notifications to trusted contacts with location
- **Voice Activation**: Trigger SOS with custom code word detection

### 👥 Smart Contact Management
- Add/remove emergency contacts from phone
- Customize emergency messages
- Set primary emergency contact
- Real-time contact synchronization

### 🗺️ Location & Navigation
- Real-time interactive maps
- Accuracy radius visualization
- Reverse geolocation (place name lookup)
- Location history tracking

### 🎓 Educational Resources
- Safety tips in 4 categories (Home, Travel, Digital, Workplace)
- Bilingual support (English & Hindi)
- Animated tips display

### 📊 Analytics & History
- Complete SOS alert history
- Media playback (audio & photos)
- Location replay on maps
- Status tracking & analytics

### 🔐 User Security
- Phone-based authentication
- Secure session management
- Local data encryption
- Permission-based access control

---

## 📚 Documentation

Complete documentation is organized into specialized guides for different audiences:

### 🎯 Choose Your Starting Point

| Document | Best For | Time |
|----------|----------|------|
| **[QUICK_START.md](./QUICK_START.md)** | Getting started in 5 mins | ⚡ 5 min |
| **[README_DETAILED.md](./README_DETAILED.md)** | Full project overview | 📖 20 min |
| **[COMPONENTS_SCREENS.md](./COMPONENTS_SCREENS.md)** | Building UI components | 🧩 15 min |
| **[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** | Understanding backend APIs | 🔌 25 min |
| **[DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)** | Environment setup & config | ⚙️ 15 min |

### 📋 Documentation Index

**New Developer?**
```
1. Start: QUICK_START.md
2. Then: README_DETAILED.md  
3. Setup: DEPENDENCIES_SETUP.md
```

**Building Components?**
```
→ COMPONENTS_SCREENS.md
```

**Integrating APIs?**
```
→ API_ARCHITECTURE.md (with code examples)
```

**Setting Up Environment?**
```
→ DEPENDENCIES_SETUP.md (Android/iOS config)
```

**Understanding the App?**
```
→ README_DETAILED.md (complete overview)
```

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
Node.js ≥20.0.0
npm ≥10.0.0
Android SDK (for Android)
Xcode (for iOS)
```

### 2. Install Dependencies
```bash
# Clone repo
git clone https://github.com/yourusername/Rakshak-React-Native.git
cd Rakshak-React-Native/RakshakAPP

# Install packages
npm install

# iOS only
cd ios && pod install && cd ..
```

### 3. Run App
```bash
# Android
npm run android

# iOS
npm run ios

# Or start Metro bundler
npm start
```

### 4. Setup User Profile
- Login/Register at startup
- Set emergency code word
- Add trusted emergency contacts
- Configure emergency message

### 5. Test SOS
- Press red SOS button on Home tab
- Watch real-time tracking
- Check SMS notifications

**👉 More details:** [QUICK_START.md](./QUICK_START.md)

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   App.tsx (Entry)       │
├─────────────────────────┤
│  Providers:             │
│  ├─ CameraProvider      │
│  ├─ SafeAreaProvider    │
│  └─ NavigationContainer │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   Layout + Navigation   │
│  ├─ StackNavigation     │
│  └─ TabNavigation       │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   9 Screens             │
│  (Home, Profile, etc)   │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   5 Components          │
│  (SOSButton, Map, etc)  │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   8 Services            │
│  (Audio, Location, etc) │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│   External APIs         │
│  (Backend, Maps, SMS)   │
└─────────────────────────┘
```

**👉 Detailed architecture:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)

---

## 📁 Project Structure

```
RakshakAPP/
├── src/
│   ├── app/              ← Navigation & routing (7 files)
│   ├── screens/          ← Full-screen components (9 files)
│   ├── components/       ← Reusable UI (5 files)
│   ├── services/         ← Business logic (8 files)
│   ├── utils/            ← Helpers & constants (2 files)
│   └── assets/           ← Images & resources
├── android/              ← Android native code
├── ios/                  ← iOS native code
├── App.tsx               ← App entry point
├── package.json          ← Dependencies (44 total)
└── [Documentation files] ← See below
```

---

## 💻 Tech Stack

### Frontend
- **React** 19.2.4
- **React Native** 0.83.1
- **TypeScript** 5.8.3
- **React Navigation** 7.x (Stack + Tabs)

### Core Features
- **Audio**: react-native-audio-record, Voice-to-text
- **Location**: react-native-geolocation-service, Google Maps
- **Camera**: react-native-vision-camera
- **SMS**: react-native-get-sms-android
- **Storage**: AsyncStorage

### UI Components
- react-native-elements
- react-native-heroicons
- react-native-svg

### Development
- Jest (testing)
- ESLint + Prettier (code quality)
- Babel (transpilation)

**👉 Full dependency list:** [DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)

---

## 🔌 API Endpoints

Backend: `https://rakshak-gamma.vercel.app`

### Key Endpoints
```
Authentication:
POST   /api/auth/signin         (Login)
POST   /api/auth/signup        (Register)

SOS Management:
POST   /api/sos-alert          (Create SOS)
PUT    /api/sos-alert/{id}     (Update location)
GET    /api/sos-alert/{id}     (Get details)

User Data:
GET    /api/user/{id}/details  (Get profile)
PUT    /api/user/{id}/update   (Update profile)

Media:
POST   /api/media/upload       (Upload audio/photos)
```

**👉 Complete API reference:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)

---

## 📱 Supported Platforms

| Platform | Min Version | Status |
|----------|-------------|--------|
| Android | API 24 | ✅ Tested |
| iOS | 13.0 | ✅ Tested |

### Permissions Required

**Android:**
- Location (fine, coarse, background)
- Camera & Microphone
- Storage (read/write)
- Contacts
- SMS (send/receive)

**iOS:**
- Location
- Camera
- Microphone
- Contacts
- Photos

---

## 🔐 Key Security Features

✅ **Secure Authentication** - Phone + password with validation
✅ **Encrypted Storage** - LocalStorage encryption on device
✅ **HTTPS Communication** - All API calls secured
✅ **Permission Validation** - Runtime permission checks
✅ **Session Management** - Secure token-based sessions
✅ **Data Privacy** - No unnecessary data collection

---

## 🚨 SOS Workflow

```
User presses SOS button
    ↓
[1] Get current location
[2] Create SOS alert (receive ID)
[3] Start audio recording
[4] Initialize camera
[5] Start location tracking (every 40 sec)
[6] Fetch and notify trusted contacts
[7] Upload media (audio, photos)
    ↓
Continuous updates until stopped
    ↓
User stops or reaches time limit
    ↓
Upload final media & close session
```

**👉 Detailed workflow:** [README_DETAILED.md](./README_DETAILED.md)

---

## 🛠️ Development

### Available Commands

```bash
# Start development
npm start                 # Start Metro bundler
npm run android          # Run on Android
npm run ios              # Run on iOS

# Code quality
npm run lint             # Check code
npm run format           # Auto-format code

# Testing
npm test                 # Run tests
npm run build            # Production build
```

### Project Statistics

| Metric | Value |
|--------|-------|
| **Screens** | 9 |
| **Components** | 5 |
| **Services** | 8 |
| **Dependencies** | 44 |
| **TypeScript Files** | 60+ |
| **Lines of Code** | 5000+ |

---

## 🐛 Troubleshooting

### Common Issues

**App crashes on startup?**
```bash
npm start -- --reset-cache
```

**Location not detected?**
```
→ Enable GPS
→ Set location mode to "High Accuracy"
→ Grant permission in app settings
```

**Audio recording fails?**
```
→ Check microphone permission
→ Verify microphone works in system settings
```

**More troubleshooting:** [README_DETAILED.md](./README_DETAILED.md#troubleshooting)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Add JSDoc comments for functions
- Write descriptive commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💼 Contact & Support

| Channel | Details |
|---------|---------|
| **Email** | support@rakshak.app |
| **Website** | https://rakshak-gamma.vercel.app |
| **GitHub** | Issues & Discussions |
| **Emergency** | Call local emergency services (911, 112) |

---

## 📖 Additional Resources

### Documentation Files
- 📘 [QUICK_START.md](./QUICK_START.md) - 5-minute setup guide
- 📗 [README_DETAILED.md](./README_DETAILED.md) - Complete project documentation
- 📙 [COMPONENTS_SCREENS.md](./COMPONENTS_SCREENS.md) - Component & screen reference
- 📕 [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) - API & architecture guide
- 📓 [DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md) - Environment setup

### External Links
- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Android Developers](https://developer.android.com/)
- [Apple Developer](https://developer.apple.com/)

---

## 🎯 Roadmap

### v2.0 (Planned)
- [ ] Emergency services integration
- [ ] Blockchain incident verification
- [ ] AI threat detection
- [ ] Wearable device sync
- [ ] Group safety features
- [ ] Real-time police dispatch

### Performance
- [ ] Reduce bundle size
- [ ] Optimize battery usage
- [ ] Improve location accuracy
- [ ] Faster media uploads

---

## 📊 Status

| Component | Status | Last Updated |
|-----------|--------|--------------|
| **Core SOS** | ✅ Production Ready | Mar 2026 |
| **Voice Recognition** | ✅ Working | Mar 2026 |
| **Location Tracking** | ✅ Tested | Mar 2026 |
| **Audio Recording** | ✅ Functional | Mar 2026 |
| **SMS Notifications** | ✅ Implemented | Mar 2026 |
| **Photo Capture** | ✅ Auto-capture | Mar 2026 |
| **Maps Integration** | ✅ Active | Mar 2026 |

---

## ⭐ Highlights

- 🎯 **Fast SOS Activation** - One-tap emergency alert
- 🎤 **Voice Trigger** - Hands-free SOS with code word
- 📍 **Real-Time Tracking** - GPS updates every 40 seconds
- 📱 **Dual Media Capture** - Audio recording + auto-photos
- 👥 **Smart Notifications** - SMS to trusted contacts instantly
- 🎨 **Beautiful UI** - Modern design with animations
- 🔒 **Secure** - End-to-end communication
- 🌍 **Multi-Platform** - Android & iOS support

---

<div align="center">

### 🛡️ Protecting Lives, One Alert at a Time

**Made with ❤️ for Safety & Security**

[📖 Explore Documentation](./QUICK_START.md) • [🐛 Report Issue](https://github.com/yourusername/Rakshak-React-Native/issues) • [💬 Discussions](https://github.com/yourusername/Rakshak-React-Native/discussions)

---

**Last Updated:** March 18, 2026  
**Version:** 0.0.1  
**Status:** ✅ Active Development

</div>
