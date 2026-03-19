# 📚 RAKSHAK - API Reference & Web Dashboard.

Api and Dashboard GitHub: https://github.com/Samad10jan/rakshak

## Table of Contents
1. [API Reference](#api-reference)
2. [Architecture Overview](#architecture-overview)
3. [Service Layer Documentation](#service-layer-documentation)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## API Reference

---

## 🌐 Live

| Resource | URL |
|---|---|
| API Base URL | `https://rakshak-gamma.vercel.app/api/` |
| Web Dashboard | `https://rakshak-gamma.vercel.app` |

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Mobile App | React Native |
| Backend / API | Next.js (API Routes) |
| Database | MongoDB via Prisma |
| Media Storage | Cloudinary |
| Auth | JWT (web dashboard) |
| Deployment | Vercel |

---

## ✨ Features

### Mobile App (React Native)
- One-tap SOS alert with live GPS location
- Auto-capture photos and audio during emergencies
- Manage trusted contacts (name + phone)
- Set a custom code word and emergency message
- View personal SOS history

### Web Dashboard (Next.js)
- Sign in with JWT-protected authentication
- View full SOS history with **date filtering**
- Inspect each SOS: location, status, attached media (photos & audio)
- Live location polling for active SOS alerts
- API documentation page with interactive test panel (access-code protected)

---

## 📡 API Reference

All endpoints are prefixed with `https://rakshak-gamma.vercel.app/api/`
### 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user. Required: `email`, `username`, `phoneNumber`, `password`. Automatically creates userDetails with default emergency settings. |
| `POST` | `/auth/signin` | Sign in using `phoneNumber` and `password`. Returns user data and sets a JWT cookie (`token`). |

<details>
<summary>Signup example</summary>

**Request**
```json
{
  "email": "user@example.com",
  "username": "Riya",
  "phoneNumber": "9827453783",
  "password": "jkAbc!@12"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "68fcc70c132244eaf83b68b0",
    "username": "Riya",
    "email": "user@example.com",
    "phoneNumber": "9827453783",
    "createdAt": "2025-10-25T12:48:12.732Z"
  }
}
```
</details>

---

### 👤 User

| Method | Endpoint | Description |
|---|---|---|
| `GET / PUT / DELETE` | `/user/[id]` | Fetch, update, or delete a user by ID |
| `GET / PUT` | `/user/[id]/details` | Fetch or update user details including `permanentAddress`, `codeWord`, and emergency `message` |

---

### 🤝 Trusted Friends

| Method | Endpoint | Description |
|---|---|---|
| `GET / POST` | `/user/[id]/trusted-friends` | List or add a trusted contact |
| `PUT / DELETE` | `/user/[id]/trusted-friends/[friendId]` | Edit or remove a specific contact |

<details>
<summary>Add friend example</summary>

**Request**
```json
{ "name": "Ali", "phone": "9876543211" }
```

**Response**
```json
{
  "success": true,
  "message": "Friend added successfully",
  "friend": {
    "id": "8s7d09as8d0a9",
    "name": "Ali",
    "phone": "9876543211"
  }
}
```
</details>

---

### 🚨 SOS Alerts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sos-alert` | Create a new SOS alert linked to a user |
| `GET` | `/sos-alert` | Admin endpoint to fetch all SOS alerts |
| `GET / PUT / DELETE` | `/sos-alert/[id]` | Fetch, update, or delete a specific SOS alert |
| `GET` | `/sos-alert/user/[userid]` | Fetch SOS history of a specific user including media |

<details>
<summary>Create SOS example</summary>

**Request**
```json
{
  "userId": "68ffa766ac0cd72ed42de692",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "status": "active"
}
```

**Response**
```json
{
  "success": true,
  "message": "SOS alert created successfully",
  "sos": {
    "id": "6530a1f3b5c7da1a5a2b2cd9",
    "timestamp": "2025-10-25T11:32:56.492Z",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "status": "active"
  }
}
```
</details>

---

### 🗂️ Media

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/media/upload` | Upload images and/or audio linked to an SOS alert |
| `GET` | `/media/[id]` | Fetch all media linked to a specific SOS alert ID |

**Upload limits:** Images up to **13 MB**, audio up to **15 MB**. Files are stored in Cloudinary under `Rakshak_uploads/images` and `Rakshak_uploads/audio`.

<details>
<summary>Upload media example</summary>

**Form fields**
```
sosAlertId  — string (required)
files       — image files (multiple)
audio       — single audio file (optional)
```

**Response**
```json
{
  "uploaded": [
    {
      "id": "media123",
      "sosAlertId": "6530a1f3b5c7da1a5a2b2cd9",
      "type": "photo",
      "url": "https://res.cloudinary.com/...",
      "format": "jpg",
      "uploadedAt": "2025-10-25T11:33:00.000Z"
    }
  ]
}
```
</details>

---

## 🖥️ Web Dashboard Screenshots
<!-- <img width="1895" height="952" alt="image" src="https://github.com/user-attachments/assets/b27232b3-813e-4ebe-9193-b1bdd4be0e51" /> -->

| Page | Preview |
|---|---|
| Landing Page | ![Landing](https://github.com/user-attachments/assets/03444523-aa7e-4803-a476-27631e9d8e53) |
| SOS History (with date filter) | ![SOS History](https://github.com/user-attachments/assets/4d2f6aad-cf43-4cf0-b5c5-e606cf8ebad0) |
| Active SOS Alert | ![Active SOS](https://github.com/user-attachments/assets/d38c7f80-2b6c-43d2-983d-8bcabd162079) |
| Individual SOS Page | ![SOS Media](https://github.com/user-attachments/assets/b27232b3-813e-4ebe-9193-b1bdd4be0e51) |
| SOS Location Polling | ![Location Polling](https://github.com/user-attachments/assets/d825033f-8434-4a21-8248-c998ee5ce4dd) |
| API Docs Page | ![API Docs](https://github.com/user-attachments/assets/8a46959e-c656-47a3-b826-10202f749dce) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string
- Cloudinary account

### Environment Variables

```env
DATABASE_URL=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
```

### Install & Run 

```bash
git clone https://github.com/Samad10jan/rakshak
cd rakshak
npm install
npm run dev
```

---
## 📁 Project Structure of rakshak web app
```
RAKSHAK/
├── .next/
├── generated/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   ├── documentation/
│   │   │   └── page.tsx            # API docs page
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── sos/
│   │   │   ├── [sosId]/
│   │   │   │   └── page.tsx        # Individual SOS page
│   │   │   └── page.tsx            # SOS history page
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page
│   ├── components/
│   └── lib/
├── .env
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
└── tsconfig.json

```

## 📁 API Structure

```
src/
└── app/
    └── api/
        ├── auth/
        │   ├── signin/
        │   │   └── route.ts        # POST sign in user
        │   └── signup/
        │       └── route.ts        # POST register new user
        ├── media/
        │   ├── [id]/
        │   │   └── route.ts        # GET media for a specific SOS alert
        │   └── upload/
        │       └── route.ts        # POST upload images/audio
        ├── sos-alert/
        │   ├── [id]/
        │   │   └── route.ts        # GET, PUT, DELETE specific alert
        │   ├── user/[userid]/
        │   │   └── route.ts        # GET all alerts for a specific user
        │   └── route.ts            # GET all alerts (admin), POST create new alert
        └── user/[id]/
            ├── details/
            │   └── route.ts        # GET, PUT user details
            ├── trusted-friends/
            │   ├── [friendId]/
            │   │   └── route.ts    # PUT, DELETE specific friend
            │   └── route.ts        # GET, POST trusted friends
            └── route.ts            # GET, PUT, DELETE user
```
## Data Models

Rakshak uses **Prisma ORM with MongoDB** with ObjectId-based document modeling, explicit foreign-key relations, and cascading deletes.

---

### ⚙️ Design decisions

| Concern | Choice |
|---|---|
| Database | MongoDB (NoSQL, document-based) |
| ORM | Prisma (`@db.ObjectId` for MongoDB compat) |
| ID strategy | `String @id @default(auto()) @map("_id") @db.ObjectId` |
| Relations | Manual FK (`@db.ObjectId`) + Prisma `@relation` |
| Cascading | `onDelete: Cascade` on all dependent models |

---

### 🧑 User

```prisma
model User {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  username    String
  email       String?  @unique
  phoneNumber String   @unique
  password    String
  createdAt   DateTime @default(now())

  details UserDetails?
}
```

- `phoneNumber` is the primary login identifier
- `email` is optional with sparse unique constraint
- 1:1 relation owned by `UserDetails` (FK lives there)

---

### 📄 UserDetails

```prisma
model UserDetails {
  id               String          @id @default(auto()) @map("_id") @db.ObjectId
  userId           String          @unique @db.ObjectId
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  permanentAddress Json?
  codeWord         String          @default("help")
  message          String          @default("HELP!!! I am in danger.")

  trustedFriends   TrustedFriend[]
  sosHistory       SOSAlert[]
}
```

- `@unique userId` enforces 1:1 with `User`
- `Json` used for flexible address structure (lat/lng or full address)
- Aggregation root for trusted contacts and SOS alerts

---

### 🤝 TrustedFriend

```prisma
model TrustedFriend {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  userDetailsId String      @db.ObjectId
  userDetails   UserDetails @relation(fields: [userDetailsId], references: [id], onDelete: Cascade)

  name          String
  phone         String      @unique
}
```

- Many-to-one with `UserDetails`
- `phone` globally unique — prevents duplicates across users

---

### 🚨 SOSAlert

```prisma
model SOSAlert {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  userDetailsId String      @db.ObjectId
  userDetails   UserDetails @relation(fields: [userDetailsId], references: [id], onDelete: Cascade)

  timestamp     DateTime    @default(now())
  location      Json?
  status        Status      @default(inactive)

  media         Media[]
}
```

- `Json` location allows flexible GPS: `{ lat, lng }`
- Recommended indexes: `userDetailsId`, `timestamp`

---

### 🗂️ Media

```prisma
model Media {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  sosAlertId String    @db.ObjectId
  sosAlert   SOSAlert  @relation(fields: [sosAlertId], references: [id], onDelete: Cascade)

  type       MediaType
  publicId   String
  url        String
  format     String

  duration   Int?
  width      Int?
  height     Int?

  uploadedAt DateTime  @default(now())
}
```

- Cloudinary integration: `publicId` → asset ref, `url` → delivery URL
- Optional metadata fields depend on media type

---

### 🔢 Enums

```prisma
enum MediaType {
  audio
  video
  photo
}

enum Status {
  active
  inactive
}
```

---

### 🔗 Relationship summary

| Relation | Type | Implementation |
|---|---|---|
| User → UserDetails | 1:1 | `userId @unique` |
| UserDetails → TrustedFriend | 1:N | FK in TrustedFriend |
| UserDetails → SOSAlert | 1:N | FK in SOSAlert |
| SOSAlert → Media | 1:N | FK in Media |

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APP.tsx (Entry Point)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐    ┌──────────┐    ┌────────────┐
   │ Camera  │    │ Safe     │    │Navigation  │
   │Provider │    │ Area     │    │Container   │
   └─────────┘    │Provider  │    └────────────┘
                  └──────────┘

                         ▼
        ┌────────────────────────────────┐
        │    Layout.tsx (Router)         │
        ├────────────────────────────────┤
        │  StackNavigation.tsx           │
        │  ├─ Splash/Auth/MainApp        │
        │  └─ Stack-based routing        │
        │                                │
        │  TabNavigation.tsx             │
        │  ├─ Home (SOS)                 │
        │  ├─ Tips                       │
        │  ├─ Contacts                   │
        │  └─ Profile                    │
        └────────────────────────────────┘

                         ▼
        ┌────────────────────────────────┐
        │  Screens Layer (9 Screens)     │
        ├────────────────────────────────┤
        │  ├─ SplashScreen.tsx           │
        │  ├─ Login.tsx                  │
        │  ├─ Register.tsx               │
        │  ├─ Home1.tsx                  │
        │  ├─ Profilescreen.tsx          │
        │  └─ ... (others)               │
        └────────────────────────────────┘

                         ▼
        ┌────────────────────────────────┐
        │  Components Layer (5 Components)
        ├────────────────────────────────┤
        │  ├─ SOSButton (CORE) ⭐        │
        │  ├─ GlobalCamera (Context)     │
        │  ├─ Map                        │
        │  ├─ Imageslider                │
        │  └─ SendEmergencyButton        │
        └────────────────────────────────┘

                         ▼
        ┌────────────────────────────────┐
        │  Services Layer (8 Services)  │
        ├────────────────────────────────┤
        │  ├─ sosApi.ts (API calls)      │
        │  ├─ locationService.ts (GPS)   │
        │  ├─ audioService.ts            │
        │  ├─ photoService.ts            │
        │  ├─ audioUploadService.ts      │
        │  ├─ voiceRecognizer.ts         │
        │  ├─ notificationService.ts     │
        │  └─ sosHandler.ts              │
        └────────────────────────────────┘

                         ▼
        ┌────────────────────────────────┐
        │  Utils & Helpers               │
        ├────────────────────────────────┤
        │  ├─ permissions.ts             │
        │  └─ constants.ts               │
        └────────────────────────────────┘

                         ▼
        ┌────────────────────────────────┐
        │  External APIs                │
        ├────────────────────────────────┤
        │  ├─ Backend Server             │
        │  ├─ Google Maps                │
        │  ├─ OneSignal                  │
                        └────────────────────────────────┘
```

---

### Frontend to Backend Data Flow Architecture

```
SOS Triggered
     │
     ├─ Component: SOSButton.tsx
     │  │
     │  ├─ Step 1: Get GPS Location
     │  │  └─ Service: locationService.getCurrentLocation()
     │  │
     │  ├─ Step 2: Create SOS Entry
     │  │  └─ Service: sosApi.createSOS(userId, location)
     │  │
     │  ├─ Step 3: Start Media Capture (Parallel)
     │  │  ├─ Service: audioService.startRecording()
     │  │  ├─ Service: photoService.initCamera()
     │  │  └─ Service: photoService.startAutoCapture()
     │  │
     │  ├─ Step 4: Location Tracking Loop
     │  │  └─ Every 40 sec:
     │  │     ├─ Get new GPS location
     │  │     └─ Service: sosApi.updateSOS(sosId, newLocation)
     │  │
     │  ├─ Step 5: Fetch & Notify Contacts
     │  │  ├─ Service: sosApi.fetchTrustedContacts()
     │  │  └─ Service: notificationService.notifyTrustedContacts()
     │  │
     │  └─ Step 6: Upload Media
     │     ├─ Service: audioUploadService.uploadAudio()
     │     └─ Service: photoService.uploadPhotos()
     │
     └─ Backend receives all data and stores
```

---

## Service Layer Documentation

### 1. sosApi.ts
**Purpose**: Handle SOS-related API calls

```typescript
// Create new SOS alert
createSOS(userId: string, location: LocationCoords): Promise<string>
  - POST /api/sos-alert
  - Returns: SOS ID
  - Used when: SOS button pressed

// Update SOS location/status
updateSOS(id: string, location: LocationCoords, status: string): Promise<void>
  - PUT /api/sos-alert/{id}
  - Called: Every 40 seconds during SOS
  - Params: lasLatitude, Longitude, Status

// Get SOS details
getSOS(id: string): Promise<SOSItem>
  - GET /api/sos-alert/{id}
  - Returns: Full SOS with media & notifications
```

---

### 2. locationService.ts
**Purpose**: GPS and geolocation operations

```typescript
// Get single location
getCurrentLocation(): Promise<LocationCoords | null>
  - Uses: react-native-geolocation-service
  - High accuracy enabled
  - 15 second timeout
  - Returns: { lat, lng }

// Watch location changes
watchLocation(callback): WatchId
  - Continuous location updates
  - 10m distance filter
  - 5 second interval minimum
```

---

### 3. audioService.ts
**Purpose**: Audio recording control

```typescript
// Initialize audio settings
initAudio(): void
  - Sample rate: 16kHz
  - Channels: Mono (1)
  - Bits: 16-bit
  - Output: audio.wav

// Start recording
startRecording(): void
  - Begin capturing microphone

// Stop recording
stopRecording(): Promise<string>
  - Stop capture
  - Returns: Path to audio.wav file
```

---

### 4. photoService.ts
**Purpose**: Camera and photo operations

```typescript
// Initialize camera
initCamera(cameraRef: React.RefObject<Camera>): Promise<void>
  - Request permissions
  - Store camera reference
  - Create storage directory

// Take and upload photo
takePhotoAndUpload(sosAlertId: string): Promise<void>
  - Capture from camera
  - Save locally
  - Upload to server
  - Retry up to 3 times

// Auto-capture photos
startAutoCapture(sosAlertId: string): void
  - Periodic photo capture
  - Max 10MB total size
  - Timestamps each photo
```

---

### 5. voiceRecognizer.ts
**Purpose**: Voice command detection

```typescript
// Start listening for code word
initVoiceRecognizer(onSOS: () => void): Promise<void>
  - Request microphone permission
  - Get code word from storage
  - Attach event listeners
  - Begin continuous listening

// Stop listening
stopVoiceRecognizer(): Promise<void>
  - Unsubscribe from events
  - Release microphone
  - Clean up resources

// Algorithm: Fuzzy phonetic matching
  - Clean heard text (remove punctuation, normalize)
  - Apply phonetic replacements (kh→k, ch→c, etc)
  - Compare words similarity (Levenshtein distance)
  - Trigger if match found
```

---

### 6. notificationService.ts
**Purpose**: SMS and push notifications

```typescript
// Request SMS permission
requestSmsPermission(): Promise<boolean>
  - Android only (iOS uses native)

// Build message
buildSOSMessage(sosId, location, userMessage?): string
  - Format: Multi-line SMS
  - Includes: Maps URL, SOS URL, message

// Send direct SMS
sendDirectSMS(phone: string, message: string): Promise<SMSResult>
  - Uses device SMS app
  - Returns: Success/failure status

// Notify all contacts
notifyTrustedContacts(friends, sosId, location, message?): Promise<void>
  - Loops through all trusted friends
  - Sends SMS to each
  - Logs each attempt
  - Continues even on failures
```

---


## Error Handling

### Try-Catch Pattern
```typescript
try {
  // Attempt operation
  const result = await someService.doSomething();
  
  // Success
  if (result) {
    // Update UI
    setData(result);
  }
  
} catch (error: any) {
  // Log error
  console.error("Operation failed:", error.message);
  
  // Show user feedback
  Alert.alert("Error", error.message || "Something went wrong");
  
  // Optionally retry
  if (retryable) {
    setTimeout(() => retry(), 2000);
  }
}
```

---



## Performance Considerations

### Optimization Strategies

1. **Location Tracking**
   - Distance filter: 10m (skip small movements)
   - Update interval: 40 seconds (balance timeliness vs battery)
   - Max age: 10 seconds (prefer fresh location)

2. **Photo Capture**
   - Resize before upload
   - Compression: 85% quality
   - Max size: 10MB total
   - Retry: 3 attempts with 2s delay

3. **Audio Recording**
   - Sample rate: 16kHz (balance quality vs file size)
   - Mono (single channel, smaller file)
   - Max length: 120 seconds

4. **Memory Management**
   - Use useRef for non-state values
   - Clear intervals/timeouts on unmount
   - Don't store large blobs in state
   - Clean up event listeners

---

## State Management

### AsyncStorage Keys

```
loggedInUser          → { user object }
codeWord              → "user's code word"
activeSOS             → { sosId, timestamp } (if ongoing)
sosHistory            → [{ ...sos items }]
trustedContacts       → [{ phone, name }]
```

### Context Providers

```
CameraContext         → Global camera state
NavigationContext     → Built-in React Navigation
SafeAreaContext       → Safe area insets
```

---
