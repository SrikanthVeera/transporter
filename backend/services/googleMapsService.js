const axios = require('axios');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 1. Google Places Autocomplete
exports.getAutocomplete = async (input, lat, lng, sessionToken) => {
    if (!API_KEY) throw new Error("Google Maps API Key Missing");

    // Bias results to 5km radius of user
    const locationBias = lat && lng ? `circle:5000@${lat},${lng}` : undefined;

    const params = new URLSearchParams({
        input,
        key: API_KEY,
        sessiontoken: sessionToken,
        types: 'geocode', // Addresses and places
        locationbias: locationBias
    });

    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`);

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google API Error: ${response.data.status}`);
    }

    return response.data;
};

// 2. Google Distance Matrix (Traffic Aware)
exports.getDistanceMatrix = async (origin, dest) => {
    if (!API_KEY) throw new Error("Google Maps API Key Missing");

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
            origins: origin,
            destinations: dest,
            mode: 'driving',
            departure_time: 'now', // Traffic model
            key: API_KEY
        }
    });

    if (response.data.status !== 'OK') throw new Error('Google Distance Matrix Failed');

    const element = response.data.rows[0].elements[0];
    if (element.status !== 'OK') throw new Error(`Route not found: ${element.status}`);

    return {
        distanceKm: element.distance.value / 1000,
        distanceText: element.distance.text,
        durationMins: Math.ceil((element.duration_in_traffic ? element.duration_in_traffic.value : element.duration.value) / 60),
        durationText: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text
    };
};

// 3. Google Directions (Polyline)
exports.getPolyline = async (origin, dest) => {
    if (!API_KEY) throw new Error("Google Maps API Key Missing");

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
            origin,
            destination: dest,
            mode: 'driving',
            key: API_KEY
        }
    });

    if (response.data.status !== 'OK') throw new Error('Google Directions Failed');

    return {
        points: response.data.routes[0].overview_polyline.points,
        bounds: response.data.routes[0].bounds
    };
};
