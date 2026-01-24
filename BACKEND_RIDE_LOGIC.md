# Backend Architecture: Ride & Location Logic (Ola Cabs Style)

**Role:** Senior Backend Engineer.
**Context:** Travel/Cab Booking Backend (Node.js / MySQL).
**Scope:** Location, Routing, Pricing. **No Frontend Code.**

---

## 1️⃣ LIVE LOCATION HANDLING (USER SIDE)

The backend acts as the source of truth for the ride's state. It does **not** generate GPS data; it consumes, validates, and broadcasts it.

### **The Logic Flow**
1.  **Ingest:** Client sends `POST /api/location/update` with `{ latitude, longitude, accuracy, timestamp }`.
2.  **Validate (Freshness):**
    *   Server checks if `timestamp` is older than 5 minutes. If yes -> **Discard** (Stale Data).
    *   Server checks `accuracy` (radius in meters). If `accuracy > 100m` -> **Flag** as low precision (optional warning).
3.  **Persist (Redis):** usage of Redis `GEO` commands is industry standard for high-frequency updates.
    *   `GEOADD user_locations <lng> <lat> <user_id>`
    *   Set TTL (Time To Live) to 60 minutes. We don't need permanent history of every ping unless on a Trip.
4.  **Broadcast (Socket.io):** If the user is on an active trip, emit this location to the assigned Driver instantly.

---

## 2️⃣ PICKUP → DROP DISTANCE & ETA

We use **Google Distance Matrix API** to get traffic-aware data.

### **Google API Integration**
*   **Endpoint:** `https://maps.googleapis.com/maps/api/distancematrix/json`
*   **Method:** GET
*   **Parameters:**
    *   `origins`: Pickup Lat,Lng
    *   `destinations`: Drop Lat,Lng
    *   `mode`: `driving`
    *   `departure_time`: `now` (Triggers traffic model)
    *   `key`: `YOUR_SERVER_API_KEY`

### **Backend Logic**
1.  **Check Cache (Important):**
    *   Generate a key: `dist:${pickup_geohash}:${drop_geohash}`.
    *   If valid cache exists (e.g., < 5 mins old), return it. **Saves $$$**.
2.  **Call API:** If no cache, hit Google.
3.  **Parse:** Extract `rows[0].elements[0]`.
    *   `distance.value`: Meters (Use this for price).
    *   `duration_in_traffic.value`: Seconds (Use this for accuracy).
4.  **Fallback:** If `departure_time` fails or quota exceeded, fall back to standard geometry/haversine (warn user).

---

## 3️⃣ ROUTE CALCULATION (POLYLINE)

We use **Google Directions API** to draw the path.

### **Backend Integration**
*   **Endpoint:** `https://maps.googleapis.com/maps/api/directions/json`
*   **Parameters:** `origin`, `destination`, `mode=driving`, `alternatives=false`.

### **Response Handling**
*   The API returns a huge JSON. The Backend should **only** filter and return:
    1.  `routes[0].overview_polyline.points`: The encoded string used to draw the line on the map.
    2.  `routes[0].bounds`: Viewport coordinates (ne/sw) to help frontend zoom correctly.
*   **Why?** Sending the full regular JSON bloats bandwidth. Send only the polyline string.

---

## 4️⃣ REAL PRICE CALCULATION (OLA STYLE)

Prices are calculated on the **Backend Only**. Never trust the client with price math.

### **The Formula**
```javascript
const TOTAL_PRICE = (Base_Fare + (Distance_Km * Rate_Per_Km) + (Time_Min * Rate_Per_Min)) * Surge_Multiplier;
```

### **Constants (Configured in DB per City/Car Type)**
| Component | Auto | Mini (Hatchback) | Prime (Sedan) |
| :--- | :--- | :--- | :--- |
| **Base Fare** (First 2km) | ₹30 | ₹50 | ₹80 |
| **Rate / Km** (After 2km) | ₹15 | ₹12 | ₹18 |
| **Rate / Min** (Waiting/Traffic) | ₹0 | ₹1.5 | ₹2 |
| **Min Fare** | ₹30 | ₹80 | ₹100 |

### **Example Calculation (Prime Sedan)**
*   **Input:** 12.5 km, 45 mins.
*   **Base:** ₹80 (covers first 4km for Prime).
*   **Remaining Dist:** 12.5 - 4 = 8.5 km.
*   **Distance Charge:** 8.5 * ₹18 = ₹153.
*   **Time Charge:** 45 * ₹2 = ₹90.
*   **Subtotal:** 80 + 153 + 90 = ₹323.
*   **Surge (Rainy/Peak):** 1.2x -> ₹323 * 1.2 = ₹387.6.
*   **Final:** Round to ₹388.

---

## 5️⃣ BACKEND API ENDPOINTS

### **A. Update Location**
`POST /api/location/update`
*   **Auth:** Bearer Token.
*   **Body:** `{ "lat": 12.9716, "lng": 77.5946, "heading": 120 }`
*   **Action:** Update Redis Key `user:loc:${id}`. Log to Trip History if active.

### **B. Get Ride Estimate & Route**
`GET /api/ride/estimate`
*   **Query:** `pickup_lat`, `pickup_lng`, `drop_lat`, `drop_lng`.
*   **Action:**
    1.  Call **Distance Matrix** (Get Dist/Time).
    2.  Call **Directions API** (Get Polyline).
    3.  Select Pricing Models (Auto, Mini, Prime) from DB.
    4.  Run Calculation for each type.
*   **Response:**
    ```json
    {
      "polyline": "encoded_string_xyz...",
      "estimates": [
        { "type": "auto", "price": 85, "eta_mins": 4, "distance_km": 4.2 },
        { "type": "prime", "price": 145, "eta_mins": 4, "distance_km": 4.2 }
      ]
    }
    ```

---

## 6️⃣ SECURITY & PERFORMANCE (PRODUCTION CRITICAL)

### **A. API Key Protection**
*   **Backend Key:** Store in `.env`. Restrict strictly to **IP Addresses** of your backend servers.
*   **Frontend Key:** If needed for map rendering, restrict strictly to **Android SHA-1 / iOS Bundle ID**.
*   **Never** reuse keys across environments.

### **B. Caching (Billing Protection)**
*   **Problem:** User moves pin slightly -> 5 API calls -> 5x Bill.
*   **Solution:** Round coordinates to 3-4 decimal places before caching.
    *   `12.97162` vs `12.97165` is ~3 meters. Treat as same location for cache key.
    *   Cache Duration: 5-10 minutes.

### **C. Rate Limiting**
*   Prevent a user from spamming the Estimate API.
*   Limit: 10 Estimates per minute per User.

### **D. Distance Verification**
*   **Anti-Fraud:** Driver claims "I drove 20km" but Google said "10km".
*   If `Actual_GPS_Distance > Google_Est_Distance * 1.3`, flag trip for audit.
