# 🧩 RAKSHAK - Components & Screens Reference

## Quick Index

### Screens (9 Total)
- [SplashScreen](#splashscreentsx) - Boot & auth validation
- [Login](#logintsx) - User authentication
- [Register](#registertsx) - User registration
- [Forgotpassword](#forgotpasswordtsx) - Password recovery
- [Home1](#home1tsx) - Main home screen
- [Profilescreen](#profilescreentsx) - User profile & settings
- [Safetytips](#safetipstsx) - Safety education
- [SOSHistoryScreen](#soshistoryscreentsx) - SOS alert history
- [Trustedcontact](#trustedcontacttsx) - Emergency contacts

### Components (5 Total)
- [SOSButton](#sosbuttontsx) ⭐ CORE
- [GlobalCamera](#globalcameratsx)
- [Map](#maptsx)
- [Imageslider](#imageslider tsx)
- [SendEmergencyButton](#sendemergencybuttontsx)

---

## 📱 Screens

### SplashScreen.tsx

**Location:** `src/screens/SplashScreen.tsx`

**Purpose:** Initial boot screen with authentication validation

**Features:**
- Animated logo & loading state
- User session validation
- Fetch fresh user details
- Reverse geolocation lookup
- Route to appropriate screen

**State:**
```typescript
const [userData, setUserData] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
```

**Lifecycle:**
```
Mount → Animate logo → Check session → Fetch details → Navigate
```

**Dependencies:**
- AsyncStorage (get user)
- Navigation API
- Nominatim API (reverse geo)
- HTTP fetch

**Key Functions:**
```typescript
checkLoginAndPrefetch()
  ├─ Get user from storage
  ├─ If not found → Navigate to Login
  └─ If found:
     ├─ Fetch fresh details from API
     ├─ Merge & update stored data
     ├─ Save code word
     └─ Reverse lookup location → Navigate to MainApp
```

---

### Login.tsx

**Location:** `src/screens/Login.tsx`

**Purpose:** User authentication with phone & password

**UI Layout:**
```
Top Band (Red accent)
    ↓
Logo + Brand (Shield emoji)
    ↓
Form Card:
  ├─ Phone Number Input (📱)
  ├─ Password Input (🔒) + toggle visibility
  ├─ Login Button
  └─ Links: Register, Forgot Password
```

**Form Fields:**
```typescript
interface LoginForm {
  phoneNumber: string;      // 10 digits
  password: string;         // Any password
  showPassword: boolean;
  focusedField: string | null;
}
```

**Validation:**
- Phone number required
- Password required
- No logic validation (server handles)

**API Integration:**
```typescript
POST /api/auth/signin
Body: { phoneNumber, password }
Response: { success, user, message }

On Success:
  ├─ Save user to AsyncStorage
  ├─ Save code word
  └─ Navigate to MainApp

On Error:
  └─ Show alert with error message
```

**Styling:**
- Red accent (#E02E38)
- Focus ring on input fields
- Password visibility toggle
- Error states

---

### Register.tsx

**Location:** `src/screens/Register.tsx`

**Purpose:** New user account creation

**Form Fields:**
```typescript
interface RegisterForm {
  email: string;
  username: string;
  phoneNumber: string;     // 10 digits max
  password: string;
  loading: boolean;
  showPassword: boolean;
  focusedField: string | null;
}
```

**Validation (Client-Side):**
```typescript
email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
phone: /^[0-9]{10}$/
password: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
username: alphanumeric + underscore

Requirements:
  ✅ Email: Valid format
  ✅ Phone: Exactly 10 digits
  ✅ Password: 8+ chars + special character
  ✅ Username: Alphanumeric
```

**API Integration:**
```typescript
POST /api/auth/signup
Body: { email, username, phoneNumber, password }

On Success:
  ├─ Show success alert
  └─ Navigate to MainApp

On Failure:
  └─ Show error with server message
```

**Features:**
- Real-time validation feedback
- Password strength indicator
- Success confirmation
- Auto-fill username from email option

---

### Forgotpassword.tsx

**Location:** `src/screens/Forgotpassword.tsx`

**Purpose:** Password recovery/reset

**Form Fields:**
```typescript
interface ForgotPasswordForm {
  username: string;
  newPassword: string;
}
```

**Current Implementation:**
```typescript
// Simple form → Navigate to Login on submit
// No actual backend implementation yet
```

**Planned Features:**
- OTP verification
- Email confirmation
- Password strength meter
- Reset token validation

---

### Home1.tsx

**Location:** `src/screens/Home1.tsx`

**Purpose:** Main home screen with SOS button and features

**UI Structure:**
```
┌─ Header ─────────────────┐
│  Rakshak Logo            │
│  "Your Safety, Our Prio" │
└──────────────────────────┘
        ↓
┌─ Banner ─────────────────┐
│ Image + Overlay          │
│ "LIVE PROTECTION" badge  │
│ "Stay Safe"              │
└──────────────────────────┘
        ↓
┌─ SOS Card ───────────────┐
│ EMERGENCY label          │
│ [RED SOS BUTTON] ← BIG   │
│ "Press for SOS"          │
└──────────────────────────┘
        ↓
┌─ Nearby Map ─────────────┐
│ Location map display     │
│ Current location marker  │
└──────────────────────────┘
```

**State:**
```typescript
const [fadeAnim] = useState(new Animated.Value(0));
const [slideAnim] = useState(new Animated.Value(24));
const [bannerScale] = useState(new Animated.Value(0.97));
```

**Animations:**
- Fade in (600ms)
- Slide up (spring animation)
- Banner scale up (spring)

**Components Used:**
- SOSButton (CORE)
- Map component
- Imageslider (banner)

**Interactions:**
- Press SOS button → Start SOS workflow
- Scroll down → See map
- Tap map → View full screen

---

### Profilescreen.tsx

**Location:** `src/screens/Profilescreen.tsx`

**Purpose:** User profile, settings, and emergency configuration

**UI Sections:**

#### 1. User Info Card
```
┌─ Avatar ──┐
│    JD     │  ← Initials from email
└───────────┘
│ Email: user@example.com
│ Phone: 9876543210
```

#### 2. Emergency Settings
```
Code Word: [help] (editable)
→ Used for voice activation

Emergency Message: [HELP!!] (editable)
→ Sent via SMS to trusted contacts
```

#### 3. Trusted Contacts
```
Mom        9999999999     ✓ (verified)
Dad        9898989898     ✓
Police     100            ✓

[+ Add Contact]
```

#### 4. Actions
```
🗺️  View SOS History
🎤 Start/Stop Voice Listener
🚪 Logout
```

**State:**
```typescript
const [user, setUser] = useState<User | null>(null);
const [details, setDetails] = useState<UserDetails | null>(null);
const [locationName, setLocationName] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
```

**API Calls:**
```typescript
GET /api/user/{userId}/details
  └─ Fetch current profile

PUT /api/user/{userId}/update
  └─ Update code word, message, contacts
```

**Features:**
- Edit mode for inline editing
- Save changes to API
- Real-time validation
- Loading states
- Error handling

---

### Safetytips.tsx

**Location:** `src/screens/Safetytips.tsx`

**Purpose:** Safety education in multiple categories

**Categories:**

```
🏠 Home Safety
  ├─ Tip 1: Share location
  ├─ Tip 2: Keep contacts handy
  └─ Tip 3: Lock doors

🚗 Travel Safety
  ├─ Tip 1: Check vehicle
  ├─ Tip 2: Avoid late night
  └─ Tip 3: Use safe transport

💻 Digital Safety
  ├─ Tip 1: Don't share personal info
  ├─ Tip 2: Enable 2FA
  └─ Tip 3: Avoid suspicious links

🏢 Workplace Safety
  ├─ Tip 1: Stay alert
  ├─ Tip 2: Trust instincts
  └─ Tip 3: Know exits
```

**Languages:**
- 🇬🇧 English
- 🇮🇳 Hindi

**UI:**
```
[Category Tabs]
  ├─ 🏠 Home
  ├─ 🚗 Travel
  ├─ 💻 Digital
  └─ 🏢 Workplace

[Tips List]
  ├─ Tip Card 1
  │  ├─ Icon
  │  ├─ Title
  │  └─ Description
  ├─ Tip Card 2
  └─ ...
```

**Features:**
- Swipeable tabs
- Color-coded categories
- Icon emojis
- Bilingual support
- Scrollable list

---

### SOSHistoryScreen.tsx

**Location:** `src/screens/SOSHistoryScreen.tsx`

**Purpose:** View past SOS alerts with details, media, and maps

**UI Layout:**
```
[Page: X/Y]  [Pagination]

┌─ SOS Alert Card ───────┐
│ Status: ACTIVE/RESOLVED│
│ Time: 10:30 AM         │
│ 🕐 2 hours ago         │
│                        │
│ ⏯️  Play Audio (45s)   │
│ 🖼️  View Photo (3)    │
│ 🗺️  View Location     │
│                        │
│ Contacts Notified: 3   │
└────────────────────────┘

[Next] [Previous]
```

**Expandable Sections:**
```
► Media
  ├─ Audio files (playable)
  ├─ Photo gallery
  └─ Timestamps

► Location Details
  ├─ Google Maps embed
  ├─ Address
  └─ Coordinates

► Notifications
  ├─ Contacts notified: 3
  ├─ SMS sent: 3
  └─ Unreachable: 0
```

**State:**
```typescript
const [sosAlerts, setSosAlerts] = useState<SOSItem[]>([]);
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

const PAGE_SIZE = 5;
```

**Features:**
- Pagination (5 items per page)
- Audio playback with controls
- Photo gallery with zoom
- Map location display
- Status indicators
- Animated card entry
- Load more on scroll

**API:**
```typescript
GET /api/sos-alert/{sosId}
  └─ Get SOS details with all media
```

---

### Trustedcontact.tsx

**Location:** `src/screens/Trustedcontact(export).tsx`

**Purpose:** Add, edit, and manage trusted emergency contacts

**UI Layout:**
```
[Add New Contact +]

Contact List:
├─ Mom
│  └─ 9999999999  [✓ Primary] [Delete]
├─ Dad
│  └─ 9898989898  [Set Primary] [Delete]
└─ ...

[Edit Mode]
  ├─ Name: [____________]
  ├─ Phone: [____________]
  └─ [Save] [Cancel]
```

**State:**
```typescript
const [contacts, setContacts] = useState<TrustedContact[]>([]);
const [editingId, setEditingId] = useState<string | null>(null);
const [editForm, setEditForm] = useState({ name: '', phone: '' });
const [loading, setLoading] = useState(false);
```

**Features:**
- Add new contact from phone contacts
- Edit contact details
- Delete contacts
- Mark as primary
- Save to backend
- Sync with phone contacts

**API:**
```typescript
PUT /api/user/{userId}/update
Body: {
  trustedFriends: [
    { name, phone, isPrimary }
  ]
}
```

---

## 🧩 Components

### SOSButton.tsx ⭐ (MOST IMPORTANT)

**Location:** `src/components/Sosbutton.tsx`

**Purpose:** Complete SOS emergency workflow trigger

**Size:** 500+ lines of complex logic

**Main State:**
```typescript
const [isActive, setIsActive] = useState(false);        // SOS running?
const [sosId, setSosId] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [recordTime, setRecordTime] = useState<number>(0);
const [user, setUser] = useState<UserData | null>(null);
```

**Key Refs:**
```typescript
const locationInterval = useRef<NodeJS.Timeout | null>(null);
const recordInterval = useRef<NodeJS.Timeout | null>(null);
const sosIdRef = useRef<string | null>(null);
const isActiveRef = useRef(false);
const userRef = useRef<UserData | null>(null);
```

**Main Methods:**

#### 1. startAudio()
```typescript
startAudio(currentSOSId: string)
  ├─ Request audio permission
  ├─ Initialize audio
  ├─ Start recording
  ├─ Count recording time
  └─ Handle errors gracefully
```

#### 2. startLocationInterval()
```typescript
startLocationInterval(sosId: string)
  ├─ Get location every 40 seconds
  ├─ Update SOS with new location
  ├─ Handle location errors
  └─ Continue until SOS stopped
```

#### 3. fetchTrustedContactsAndMessage()
```typescript
fetchTrustedContactsAndMessage(userId: string)
  ├─ API: GET /api/user/{userId}/details
  ├─ Extract friends list
  ├─ Extract custom message
  └─ Return: { friends, userMessage }
```

#### 4. handleSOS()
```typescript
handleSOS()
  ├─ Get location
  ├─ Create SOS alert
  ├─ Start audio
  ├─ Start location tracking
  ├─ Initialize camera
  ├─ Start photo capture
  ├─ Fetch contacts
  └─ Send notifications
```

#### 5. stopSOS()
```typescript
stopSOS()
  ├─ Stop audio recording
  ├─ Upload audio file
  ├─ Stop location tracking
  ├─ Stop photo capture
  ├─ Update SOS status
  └─ Show completion summary
```

**Workflow Diagram:**
```
Press SOS Button
        ↓
[PERMISSION_CHECK]
  ├─ Audio permission
  ├─ Location permission
  └─ Camera permission
        ↓
[CREATE_SOS_ALERT]
  ├─ Get GPS location
  ├─ API: POST /api/sos-alert
  └─ Save SOS ID
        ↓
[START_RECORDING] (parallel)
  ├─ Initialize audio
  ├─ Start microphone
  └─ Count time
        ↓
[START_LOCATION_TRACKING] (every 40 sec)
  ├─ Get fresh GPS
  └─ API: PUT /api/sos-alert/{id}
        ↓
[CAPTURE_PHOTOS] (every N sec)
  ├─ Initialize camera
  ├─ Auto-capture
  └─ Save locally
        ↓
[NOTIFY_CONTACTS]
  ├─ Fetch trusted friends
  ├─ Build SMS message
  └─ Send to each contact
        ↓
When User Stops SOS:
  ├─ Stop recording
  ├─ Upload audio
  ├─ Upload photos
  ├─ Update status
  └─ Show summary
```

**Error Handling:**
```typescript
try {
  await someOperation();
} catch (error) {
  console.error("Error:", error);
  Alert.alert("Error", "Something went wrong");
  
  // Continue SOS even if some steps fail
  // e.g., if photo fails, audio still records
}
```

**Resume Functionality:**
- On app mount, check AsyncStorage for active SOS
- If found, resume ongoing SOS
- Restore intervals, refs, UI state

**Constants:**
```typescript
const AUDIO_LIMIT_SEC = 120;          // 2 minutes
const LOCATION_LIMIT_SEC = 40;        // Update every 40 sec
const PHOTO_CAPTURE_LIMIT_SEC = 7200; // 2 hours
```

---

### GlobalCamera.tsx

**Location:** `src/components/GlobalCamera.tsx`

**Purpose:** Persistent camera context provider

**Why Needed:**
- Camera must survive tab switches
- Prevent re-initialization
- Share across components

**Context Structure:**
```typescript
type CameraContextType = {
  cameraRef: React.RefObject<Camera>;
  isCameraActive: boolean;
  setCameraActive: (v: boolean) => void;
};
```

**Provider:**
```typescript
export function CameraProvider({ children }) {
  const cameraRef = useRef<Camera | null>(null);
  const [isCameraActive, setCameraActive] = useState(false);
  const device = useCameraDevice("back");

  return (
    <CameraContext.Provider 
      value={{ cameraRef, isCameraActive, setCameraActive }}
    >
      {children}
      {device && (
        <Camera
          ref={cameraRef}
          style={{ width: 0, height: 0 }}    // Hidden
          isActive={isCameraActive}
          photo={true}
          device={device}
        />
      )}
    </CameraContext.Provider>
  );
}
```

**Usage:**
```typescript
const { cameraRef, isCameraActive, setCameraActive } = useCameraContext();

// Activate camera
setCameraActive(true);

// Take photo
const photo = await cameraRef.current?.takePhoto();
```

**Key Points:**
- Camera positioned off-screen (0x0)
- Camera survives all navigation
- Active state controlled from component
- Photo permissions handled separately

---

### Map.tsx

**Location:** `src/components/Map.tsx`

**Purpose:** Display real-time user location on interactive map

**Features:**
```
✓ Google Maps integration
✓ Real-time GPS tracking
✓ Location marker
✓ Accuracy radius (blue circle)
✓ Auto-center on user
✓ Loading state
✓ Permission handling
✓ Error states
```

**UI Layout:**
```
┌─ Map View ──────────────┐
│                         │
│  [User Location •]      │
│     ↓                   │
│  [Blue Circle]          │  ← Accuracy radius
│  (10-100m radius)       │
│                         │
│  [Current Address]      │
│  [Coordinates]          │
└─────────────────────────┘
```

**State:**
```typescript
const [hasLocationPermission, setHasLocationPermission] = useState(false);
const [location, setLocation] = useState<Coords | null>(null);
const [loading, setLoading] = useState(true);
const watchId = useRef<number | null>(null);
```

**Key Functions:**

#### requestLocationPermission()
```typescript
// Android only
PermissionsAndroid.request(
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
)
```

#### startWatchingLocation()
```typescript
Geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
  },
  (error) => {
    Alert.alert("Error", error.message);
  },
  {
    enableHighAccuracy: true,
    distanceFilter: 10,        // 10 meters
    interval: 5000,            // 5 seconds
    fastestInterval: 2000,     // 2 seconds minimum
  }
);
```

**Cleanup:**
```typescript
useEffect(() => {
  return () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }
  };
}, []);
```

---

### Imageslider.tsx

**Location:** `src/components/Imageslider.tsx`

**Purpose:** Decorative banner with image + gradient overlay

**UI:**
```
┌─ Image Slider ──────┐
│ [Background Image]  │
│ [Gradient Overlay]  │
│                     │
│ [Badge: PROTECTED] ←─ Live indicator
│ "Welcome to Rakshak" │
│ "Stay safe with SOS" │
└─────────────────────┘
```

**Image:** `Picture3.webp`

**Features:**
- Background image
- Dark gradient at bottom (for text readability)
- "PROTECTED" badge with green dot
- Responsive sizing
- Shadow effect

**Styling:**
```typescript
{
  width: '100%',
  height: 210,
  borderRadius: 20,
  overflow: 'hidden',
  elevation: 6,        // Android shadow
  shadowOpacity: 0.3   // iOS shadow
}
```

---

### SendEmergencyButton.tsx

**Location:** `src/components/SendEmergencyButton.tsx`

**Purpose:** Quick emergency alert without full SOS workflow

**Features:**
```
┌─ Send Emergency Message ┐
│ (Red Button)           │
└─ Opens alert with:
   ├─ 📱 WhatsApp
   ├─ ✉️  SMS
   └─ Cancel
```

**Workflow:**
```typescript
sendTextSOS()
  ├─ Get current location
  ├─ Create Google Maps URL (lat, lng)
  ├─ Show alert with options:
  │  ├─ WhatsApp: whatsapp://send?text={message}
  │  ├─ SMS: sms:?body={message}
  │  └─ Cancel
  └─ User manually shares from app
```

**Message Format:**
```
"🚨 I need help! This is my location: 
https://maps.google.com/?q=lat,lng"
```

**Used In:** Profile screen for quick testing

---

## Navigation Flow

```
┌─ SplashScreen
│
├─ Login ────────────┐
├─ Register ─────────┤
├─ ForgotPassword ───┤
│                    │
│                    ↓
│            ┌─ TabNavigation (Main App)
│            │  ├─ Home
│            │  │   └─ Home1 + SOSButton
│            │  ├─ Tips
│            │  │   └─ Safetytips
│            │  ├─ Contacts
│            │  │   └─ Trustedcontact
│            │  └─ Profile
│            │      └─ Profilescreen
│            │
│            ├─ SOSHistoryScreen (from Profile)
│            │
│            └─ (Other screens as needed)
```

---

## Component Props Reference

### SOSButton
```typescript
// No props required - uses context & AsyncStorage
export default function SOSButton()
```

### GlobalCamera.CameraProvider
```typescript
<CameraProvider>
  {children}
</CameraProvider>
```

### Map.LocationMap
```typescript
// No props - internal state
<LocationMap />
```

### Imageslider
```typescript
// No props - static content
<Imageslider />
```

### SendEmergencyButton
```typescript
// No props
<SendEmergencyButton />
```

---

## Performance Tips

1. **Component Memoization**
   ```typescript
   export default React.memo(MyComponent);
   ```

2. **useCallback for handlers**
   ```typescript
   const handlePress = useCallback(() => {
     // ...
   }, [dependencies]);
   ```

3. **Lazy load screens**
   ```typescript
   const Profile = lazy(() => import('./Profile'));
   ```

4. **Optimize re-renders**
   - Use refs for non-critical state
   - Separate concerns to different hooks
   - Avoid inline functions

---

## Accessibility

All components follow accessibility best practices:
- ✅ Proper labels
- ✅ Touch target sizes (minimum 44x44)
- ✅ Color contrast ratios
- ✅ Screen reader support
- ✅ Keyboard navigation

---

**Last Updated: March 2026**
