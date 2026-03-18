# 📚 RAKSHAK - API Reference & Architecture Documentation

## Table of Contents
1. [API Reference](#api-reference)
2. [Architecture Overview](#architecture-overview)
3. [Service Layer Documentation](#service-layer-documentation)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## API Reference

### Base URL
```
https://rakshak-gamma.vercel.app
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer {token} (if required)
```

---

## Authentication Endpoints

### 1. User Sign In
```http
POST /api/auth/signin
```

**Request:**
```json
{
  "phoneNumber": "9876543210",
  "password": "SecurePass@123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "details": {
      "codeWord": "help",
      "message": "HELP!!",
      "permanentAddress": {
        "lat": 28.6139,
        "lng": 77.2090
      },
      "trustedFriends": [
        { "name": "Mom", "phone": "9999999999" },
        { "name": "Dad", "phone": "9898989898" }
      ]
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. User Registration
```http
POST /api/auth/signup
```

**Request:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "phoneNumber": "9876543210",
  "password": "SecurePass@123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "phoneNumber": "9876543210"
  }
}
```

**Validation Rules:**
- Email: Valid email format
- Phone: 10 digits (numeric only)
- Password: Min 8 chars + 1 special character
- Username: Alphanumeric + underscore

---

## SOS Management Endpoints

### 3. Create SOS Alert
```http
POST /api/sos-alert
```

**Request:**
```json
{
  "userId": "user_12345",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "status": "active"
}
```

**Response (Success):**
```json
{
  "success": true,
  "sos": {
    "id": "sos_abc123xyz",
    "userId": "user_12345",
    "timestamp": "2026-03-18T10:30:00Z",
    "location": {
      "lat": 28.6139,
      "lng": 77.2090
    },
    "status": "active",
    "media": []
  }
}
```

**Status Codes:**
- `active` - SOS in progress
- `paused` - SOS paused
- `resolved` - SOS completed

---

### 4. Update SOS Alert
```http
PUT /api/sos-alert/{sosId}
```

**Path Parameters:**
- `sosId` (string): SOS alert ID from creation

**Request:**
```json
{
  "location": {
    "lat": 28.6150,
    "lng": 77.2100
  },
  "status": "active"
}
```

**Response (Success):**
```json
{
  "success": true,
  "sos": {
    "id": "sos_abc123xyz",
    "location": {
      "lat": 28.6150,
      "lng": 77.2100
    },
    "lastUpdated": "2026-03-18T10:31:00Z"
  }
}
```

**Frequency:** Called every 40 seconds during SOS

---

### 5. Get SOS Alert Details
```http
GET /api/sos-alert/{sosId}
```

**Response (Success):**
```json
{
  "success": true,
  "sos": {
    "id": "sos_abc123xyz",
    "userId": "user_12345",
    "timestamp": "2026-03-18T10:30:00Z",
    "status": "active",
    "location": {
      "lat": 28.6139,
      "lng": 77.2090
    },
    "media": [
      {
        "id": "media_001",
        "type": "audio",
        "url": "https://cdn.example.com/audio/sos_abc123xyz_001.wav",
        "duration": 45,
        "uploadedAt": "2026-03-18T10:35:00Z"
      },
      {
        "id": "media_002",
        "type": "photo",
        "url": "https://cdn.example.com/photos/sos_abc123xyz_001.jpg",
        "uploadedAt": "2026-03-18T10:33:00Z"
      }
    ],
    "notifications": {
      "contactsNotified": 3,
      "smsCount": 3,
      "unreachable": 0
    }
  }
}
```

---

## User Management Endpoints

### 6. Get User Details
```http
GET /api/user/{userId}/details
```

**Path Parameters:**
- `userId` (string): User ID

**Response (Success):**
```json
{
  "success": true,
  "details": {
    "codeWord": "help",
    "message": "I am in danger!",
    "permanentAddress": {
      "lat": 28.6139,
      "lng": 77.2090
    },
    "trustedFriends": [
      {
        "id": "contact_001",
        "name": "Mom",
        "phone": "9999999999",
        "isPrimary": true,
        "addedAt": "2026-02-01T10:00:00Z"
      },
      {
        "id": "contact_002",
        "name": "Dad",
        "phone": "9898989898",
        "isPrimary": false
      }
    ]
  }
}
```

---

### 7. Update User Details
```http
PUT /api/user/{userId}/update
```

**Request:**
```json
{
  "codeWord": "emergency",
  "message": "Help me now!",
  "permanentAddress": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "trustedFriends": [
    {
      "name": "Mom",
      "phone": "9999999999",
      "isPrimary": true
    },
    {
      "name": "Police",
      "phone": "100",
      "isPrimary": false
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User details updated successfully",
  "details": {
    "codeWord": "emergency",
    "message": "Help me now!",
    "trustedFriends": [...]
  }
}
```

---

## Media Upload Endpoints

### 8. Upload Media (Audio/Photos)
```http
POST /api/media/upload
Content-Type: multipart/form-data
```

**Request (FormData):**
```
sosAlertId: sos_abc123xyz
audio: [File] audio.wav          (Optional)
photos: [File[]] photo_001.jpg   (Optional - multiple)
```

**Response (Success):**
```json
{
  "success": true,
  "urls": [
    "https://cdn.example.com/audio/sos_abc123xyz_audio.wav",
    "https://cdn.example.com/photos/sos_abc123xyz_photo_001.jpg",
    "https://cdn.example.com/photos/sos_abc123xyz_photo_002.jpg"
  ],
  "uploadTime": "2026-03-18T10:40:00Z"
}
```

**Constraints:**
- Audio: Max 120 seconds, 16kHz, mono, WAV format
- Photos: Max 10MB total, JPEG format
- Max 5 photos per upload

---

## Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Invalid input parameters",
  "errors": {
    "phoneNumber": "Must be 10 digits",
    "password": "Must contain special character"
  }
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "Invalid credentials or expired token"
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "message": "User does not have access to this resource"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "SOS alert with ID 'sos_abc123xyz' not found"
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error. Please try again later."
}
```

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
        │  Services Layer (8 Services)   │
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
        │  External APIs                 │
        ├────────────────────────────────┤
        │  ├─ Backend Server             │
        │  ├─ Google Maps                │
        │  ├─ Nominatim (OSM)            │
        │  ├─ OneSignal                  │
        │  └─ Device Services            │
        └────────────────────────────────┘
```

---

### Data Flow Architecture

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

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  phoneNumber: string;
  username: string;
  details?: UserDetails;
}

interface UserDetails {
  permanentAddress?: {
    lat: number;
    lng: number;
  };
  codeWord?: string;       // Voice activation word
  message?: string;        // SMS message to send
  trustedFriends?: TrustedContact[];
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
  addedAt: string;
}
```

---

### SOS Model
```typescript
interface SOSItem {
  id: string;
  userId: string;
  timestamp: string;        // When SOS was triggered
  status: "active" | "paused" | "resolved";
  location: LocationCoords;
  media: MediaItem[];
  notifications: {
    contactsNotified: number;
    smsCount: number;
    unreachable: number;
  };
  lastUpdated: string;
}

interface MediaItem {
  id: string;
  type: "audio" | "photo";
  url: string;
  duration?: number;        // For audio
  uploadedAt: string;
}

interface LocationCoords {
  lat: number;
  lng: number;
}
```

---

### SOS Message Model
```typescript
interface SOSMessage {
  header: "🚨 SOS ALERT 🚨";
  body: string;              // User message or default
  location: {
    mapUrl: string;          // Google Maps link
    coordinates: string;     // Lat, Lng
  };
  details: {
    sosUrl: string;          // Link to SOS dashboard
    timestamp: string;
  };
  metadata: {
    deviceType: "Android" | "iOS";
    appVersion: string;
  };
}
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

### Error Types Handled

| Error | Handling |
|-------|----------|
| Permission Denied | Alert user + guide to settings |
| Network Timeout | Retry with exponential backoff |
| GPS Not Available | Show map location picker |
| Camera Failure | Skip photo capture, continue SOS |
| Audio Failure | Show warning, continue SOS |
| Contact Not Reachable | Log attempt, continue with others |
| Upload Failure | Retry up to 3 times automatically |

---

### Logging Strategy

```typescript
// Development logs
console.log("🎤 Listening...");        // Info
console.warn("⚠️ Permission denied");  // Warning
console.error("❌ Upload failed");     // Error

// Analytics logs
logEvent("SOS_TRIGGERED", {
  timestamp: Date.now(),
  userId,
  locationValid: !!location,
  contactsNotified: count
});
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

## Conclusion

This architecture ensures:
- ✅ **Modularity**: Each service has single responsibility
- ✅ **Reusability**: Services used across components
- ✅ **Testability**: Services can be unit tested
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Scalability**: Easy to add new services/features

---

**Last Updated: March 2026**
