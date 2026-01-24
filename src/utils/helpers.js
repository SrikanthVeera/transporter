/**
 * Core Utilities
 * Derived from advanced client-side tracking and networking patterns.
 */

// Window object reference for safely accessing globals
const w = window;

/**
 * Checks if the Fetch API is supported.
 * @returns {boolean}
 */
export const isFetchSupported = () => {
    return typeof w.fetch === "function";
};

/**
 * Robust Network Request (based on function bd)
 * Attempts to use Fetch API with advanced features (keepalive, attribution),
 * with fallbacks for older browsers if needed.
 * 
 * @param {string} url - The endpoint URL
 * @param {object} body - JSON body (optional)
 * @param {object} options - Advanced options (credentials, modes, etc.)
 * @param {function} onSuccess - Callback for success
 * @param {function} onError - Callback for failure
 */
export const secureRequest = async (url, body, options = {}, onSuccess, onError) => {
    if (isFetchSupported()) {
        const config = Object.assign({}, options);

        // Add body if present
        if (body) {
            config.body = JSON.stringify(body);
            config.headers = { ...config.headers, 'Content-Type': 'application/json' };
        }

        // Map advanced tracking properties if they exist in options
        const advancedProps = ['attributionReporting', 'browsingTopics', 'credentials', 'keepalive', 'method', 'mode'];
        advancedProps.forEach(prop => {
            if (options[prop] !== undefined) config[prop] = options[prop];
        });

        try {
            const response = await w.fetch(url, config);
            if (response && (response.ok || response.status === 0)) {
                if (onSuccess) onSuccess(await response.json());
                return true;
            } else {
                if (onError) onError();
            }
        } catch (e) {
            if (onError) onError(e);
        }
        return true;
    }

    // Fallback Logic (simplified XHR)
    // Logic from '$c' or 'dd' would typically go here
    if (onError) onError(new Error("Fetch not supported"));
    return false;
};

/**
 * Get Navigation Type (based on function gd)
 * Analyzes performance entries to determine how the user arrived at the page.
 * 
 * Returns:
 * 'n' - Standard Navigate
 * 'h' - History (Back/Forward)
 * 'r' - Reload
 * 'p' - Prerender
 * 'x' - Unknown/Other
 * 'u' - Undefined/Unsupported
 */
export const getNavigationType = () => {
    const perf = w.performance;

    if (perf && perf.getEntriesByType) {
        try {
            const entries = perf.getEntriesByType("navigation");
            if (entries && entries.length > 0) {
                const type = entries[0].type;
                switch (type) {
                    case "navigate": return "n";
                    case "back_forward": return "h";
                    case "reload": return "r";
                    case "prerender": return "p";
                    default: return "x";
                }
            }
        } catch (e) {
            return "e"; // Error accessing performance API
        }
    }
    return "u"; // Unavailable
};

/**
 * High-Precision Timestamp (based on function fd)
 * @returns {number} - DOMHighResTimeStamp
 */
export const getPerformanceNow = () => {
    const perf = w.performance;
    if (perf && typeof perf.now === 'function') {
        return perf.now();
    }
    return Date.now();
};

/**
 * Access SVG Animated Value safely (based on function ed)
 * Useful when dealing with SVG classes or properties that might be objects.
 */
export const getAnimVal = (element, attribute) => {
    const val = element[attribute];
    if (val && typeof val.animVal === "string") {
        return val.animVal;
    }
    return val;
};

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Calculate Distance & Get Price
 * Calls Backend API which handles Google Maps and Pricing Logic
 */
export const calculateDistanceAndPrice = async (pickup, drop) => {
    try {
        // 1. Get Distance from Backend
        const locationRes = await fetch(`${API_BASE_URL}/location/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pickup, drop })
        });

        if (!locationRes.ok) throw new Error('Failed to calculate distance');
        const locationData = await locationRes.json();

        // 2. Get Pricing from Backend
        const pricingRes = await fetch(`${API_BASE_URL}/pricing/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distance: locationData.distance })
        });

        if (!pricingRes.ok) throw new Error('Failed to calculate price');
        const pricingData = await pricingRes.json();

        return {
            distanceKM: locationData.distance,
            priceAuto: pricingData.prices.auto,
            priceCar: pricingData.prices.car
        };
    } catch (error) {
        console.error('Backend API Error:', error);
        // Fallback for demo if backend is not running
        return null;
    }
};




/**
 * Verify OTP via Backend
 */
export const verifyOtpApi = async (mobile, otp) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, otp })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return { success: false };
    }
};
