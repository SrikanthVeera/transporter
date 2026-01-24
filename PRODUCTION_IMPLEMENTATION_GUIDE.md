# Production Implementation Guide: Transporter App

**Role:** Senior Google Engineer
**Stack:** React / Node.js (Express) / MySQL / Google Maps / Firebase

This document outlines the **exact** steps, APIs, and code structures required to build a production-grade cab booking application. **No mocks. No fake data.**

---

## 1️⃣ REAL LIVE LOCATION

### **Flow & Implementation**

To track a user's location continuously and efficiently, we use the device's GPS sensors.

**Strategies:**
*   **Foreground:** When the app is open, we use high-accuracy GPS.
*   **Background (Driver Only):** Requires special permissions to track whilst minimized (essential for ride tracking).

### **A. Permissions (Mobile - React Native / Native)**

For a hybrid/mobile app, you must explicitly declare permissions in the manifest/info files.

**Android (`AndroidManifest.xml`):**
```xml
<!-- Precise location for navigation -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<!-- Approximate location for battery saving when precise isn't needed -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<!-- Required for Driver App to track in background -->
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

**iOS (`Info.plist`):**
```xml
<!-- Message shown when asking for permission -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby rides.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>We need your location to track your ride progress.</string>
```

### **B. React / Web Implementation (`navigator.geolocation`)**

For the specific Web/PWA context you are working in now:

```javascript
// Function: Start Tracking
const startTracking = (onLocationUpdate, onError) => {
    if (!navigator.geolocation) {
        onError(new Error("Geolocation not supported"));
        return;
    }

    // options for high accuracy
    const options = {
        enableHighAccuracy: true, // Use GPS
        timeout: 10000,           // Wait 10s max
        maximumAge: 0             // Do not use cached position
    };

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, heading, speed } = position.coords;
            // Send to function to update Map / Backend
            onLocationUpdate({ lat: latitude, lng: longitude, heading, speed });
        },
        (error) => {
            // Error Codes: 1=Denied, 2=Unavailable, 3=Timeout
            if (error.code === 1) alert("Please enable location permissions in settings.");
            onError(error);
        },
        options
    );

    return watchId; // Return ID to clearWatch later
};
```

---

## 2️⃣ REAL LOCATION AUTOCOMPLETE (LIKE GOOGLE MAPS)

This is the standard "Types to Search" feature. Do **not** use the Client-Side SDK directly for billing reasons (it exposes your key). **Proxy requests through your backend.**

### **A. API Usage**

*   **API:** Google Places API (New) / Autocomplete
*   **Endpoint:** `https://maps.googleapis.com/maps/api/place/autocomplete/json`
*   **Optimization:** Use **Session Tokens**.

**Why Session Tokens?**
Without a session token, you are billed *per character typed*. With a session token, an entire search session (typing "A", "Ap", "App", "Apple Store" + 1 Selection) is billed as **ONE** request.

### **B. Backend Implementation (Node.js)**

```javascript
// GET /api/places/autocomplete?input=Indi&lat=12.97&lng=77.59&session_token=XYZ
router.get('/autocomplete', async (req, res) => {
    const { input, lat, lng, session_token } = req.query;
    
    const params = new URLSearchParams({
        input,
        key: process.env.GOOGLE_MAPS_API_KEY,
        sessiontoken: session_token, // CRITICAL for cost saving
        locationbias: `circle:5000@${lat},${lng}`, // Bias results to 5km radius of user
        types: 'geocode|establishment' // Limit to meaningful places
    });

    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`);
    res.json(response.data);
});
```

### **C. Frontend Behavior**
1.  Generate `uuid` as `session_token` on `input` focus.
2.  Pass this token with every keystroke.
3.  When user **clicks** a suggestion, call **Place Details API** with the *same* token.
4.  Invalidate/Regenerate token after selection.

---

## 3️⃣ REAL DISTANCE CALCULATION

Standard geometry (Haversine formula) is **wrong** for cabs because it measures "As the crow flies" (straight line). You need **Road Distance**.

### **A. API Usage**

*   **API:** Google Distance Matrix API (Preferred for multiple sources/dest) or Directions API.
*   **Endpoint:** `https://maps.googleapis.com/maps/api/distancematrix/json`

### **B. Backend Implementation**

```javascript
/*
 * Calculate Fare
 * @param {string} origin "12.9716,77.5946"
 * @param {string} dest "12.9352,77.6245"
 */
async function calculateFare(origin, dest) {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
            origins: origin,
            destinations: dest,
            mode: 'driving',
            departure_time: 'now', // triggers traffic_model='best_guess'
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    });

    const data = response.data.rows[0].elements[0];
    if (data.status !== 'OK') throw new Error("Route not found");

    const distanceKm = data.distance.value / 1000;
    const durationMins = data.duration_in_traffic ? (data.duration_in_traffic.value / 60) : (data.duration.value / 60);

    // --- Dynamic Pricing Logic ---
    const BASE_FARE = 50; 
    const PER_KM_RATE = 14; 
    const PER_MIN_WAIT = 2;
    
    // Surge Multiplier (Night: 10PM - 6AM)
    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour < 6;
    const surge = isNight ? 1.5 : 1.0;

    const totalFare = (BASE_FARE + (distanceKm * PER_KM_RATE) + (durationMins * PER_MIN_WAIT)) * surge;
    
    return {
        fare: Math.round(totalFare),
        distance: distanceKm.toFixed(1),
        eta: Math.round(durationMins)
    };
}
```

---

## 4️⃣ REAL OTP VERIFICATION

### **Method A: Firebase Phone Auth (Recommended)**
This is cleaner, cheaper (first 10k free/month), and handles security automatically.

1.  **Client:** Initializes `RecaptchaVerifier` (invisible).
2.  **Client:** Calls `signInWithPhoneNumber(mobile)`.
3.  **Firebase:** Sends SMS.
4.  **Client:** Inputs code -> Calls `confirmationResult.confirm(code)`.
5.  **Result:** Returns User UID & ID Token.
6.  **Backend:** Verify ID Token using `firebase-admin`.

```javascript
// Backend Verification Route
router.post('/verify-firebase-token', async (req, res) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Valid User -> Create Session/JWT
        res.json({ success: true, uid: decodedToken.uid });
    } catch (e) {
        res.status(401).json({ error: 'Invalid Token' });
    }
});
```

### **Method B: SMS Gateway (Twilio / Fast2SMS)**
Used if you need custom branding or backend control.

1.  **Generate:** `crypto.randomInt(100000, 999999)`.
2.  **Hash:** `bcrypt.hash(otp)` -> Store in DB/Redis with `mobile` + `expiry (5 mins)`.
3.  **Send:** API Call to Twilio.
4.  **Verify:**
    *   Find record by mobile.
    *   Check `expiry > now`.
    *   `bcrypt.compare(inputOtp, storedHash)`.
    *   If correct, delete record (One-Time use).

**Why Frontend-Only OTP is Dead Wrong:**
If you generate OTP in React and check `if (input === generated)`, any hacker can inspect the `generated` variable in the browser console or network tab. **OTP must originate and be verified on the server.**

---

## 5️⃣ SECURITY & COMPLIANCE

| Feature | Production Implementation |
| :--- | :--- |
| **API Keys** | **Never commit to Git.** Use `.env`. Restrict Google Maps keys in Cloud Console to your specific Android SHA-1 fingerprint and iOS Bundle ID. |
| **Rate Limiting** | Use `express-rate-limit`. Limit OTP requests to 3 per 10 mins per IP/Mobile to prevent "SMS Bombing" attacks. |
| **Data Privacy** | Store user location history only if consented. Encrypt PII (Personally Identifiable Information) in Database. |
| **SSL/TLS** | Production API must use HTTPS (LetsEncrypt/AWS ACM). |

---

## 6️⃣ ARCHITECTURE DIAGRAM (Text-Based)

```
[ Mobile App / React PWA ]
       |    ^
       |    | (1) WebSocket: Live Driver Location
       |    | (2) HTTPS: REST API (Book, Auth)
       v    |
[ Load Balancer (Nginx) ]
       |
[ Node.js Backend Cluster ] <---> [ Redis (Cache/Session/OTP) ]
       |          |
       |          +----> [ Google Maps Platform (Distance, Places) ]
       |
       v
[ MySQL Database (Users, Rides, Transactions) ]
```

---

### **Action Plan**
1.  **Backend:** Add `.env` variables for `GOOGLE_MAPS_API_KEY`, `TWILIO_SID`/`FIREBASE_VARS`.
2.  **Backend:** Enable Google Places, Geocoding, and Distance Matrix APIs in Google Cloud Console.
3.  **Frontend:** Switch from `OpenStreetMap` fetch checks to your own backend endpoints (`/api/location/search`, `/api/location/price`).
4.  **Database:** Ensure `otp_logs` table exists for rate limiting.

