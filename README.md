# RAKSHAK - Emergency Safety & SOS Alert App

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.83.1-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?logo=android&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D20-green?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative&logoColor=white)

**Rakshak** — *Your Safety, Our Priority* 

A comprehensive React Native mobile application providing real-time emergency safety features with one-tap SOS alerts, real-time location tracking, voice activation, and instant SMS notifications to trusted emergency contacts.

</div>

---

## 📚 Documentation Files 

Complete documentation is organized into specialized guides for different audiences:

### 🎯 Choose Your Starting Point

| Document | Best For |
|----------|----------|
| **[README_DETAILED.md](./README_DETAILED.md)** | Full project overview | 
| **[COMPONENTS_SCREENS.md](./COMPONENTS_SCREENS.md)** | Building UI components | 
| **[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** | Understanding backend APIs | 
| **[DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)** | Environment setup & config 


**About Components and Screens**
**[COMPONENTS_SCREENS.md](./COMPONENTS_SCREENS.md)**

**Integrating APIs**

**[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** 


**Dependencies and Setup**
**[DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)**

**Full App detailed workflow**
 **[README_DETAILED.md](./README_DETAILED.md)**


---

## 🏗️ Architecture

**👉 Detailed architecture:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)

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



---

## 📁 Project Structure

**👉 Full dependency list:** [DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)

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

**👉 Full dependency list:** [DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md)




---

## 🔌 API Endpoints and Web Dashboard Using Nextjs 

Backend:
`https://rakshak-gamma.vercel.app/api`
Web dashboard: 
https:`https//rakshak-gamma.vercel.app`

**👉 Complete API reference:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)

---

## 🚨 SOS Workflow

**👉 Detailed workflow:** [README_DETAILED.md](./README_DETAILED.md)

---
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


### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Add JSDoc comments for functions
- Write descriptive commit messages

---

## Documentation Files

- 📗 [README_DETAILED.md](./README_DETAILED.md) - Complete project documentation
- 📙 [COMPONENTS_SCREENS.md](./COMPONENTS_SCREENS.md) - Component & screen reference
- 📕 [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) - API & architecture guide
- 📓 [DEPENDENCIES_SETUP.md](./DEPENDENCIES_SETUP.md) - Environment setup
---
## External Links
- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Android Developers](https://developer.android.com/)
- [Apple Developer](https://developer.apple.com/)

---

## 🎯 Future Scope 

[README_DETAILED.md](./README_DETAILED.md) - Complete project documentation

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

## ⭐ Highlights

- 🎯 **Fast SOS Activation** - One-tap emergency alert
- 🎤 **Voice Trigger** - Hands-free SOS with code word
- 📍 **Real-Time Tracking** - GPS updates every 40 seconds
- 📱 **Dual Media Capture** - Audio recording + auto-photos
- 👥 **Smart Notifications** - SMS to trusted contacts instantly
- 🎨 **Beautiful UI** - Modern design with animations
- 🔒 **Secure** - End-to-end communication
