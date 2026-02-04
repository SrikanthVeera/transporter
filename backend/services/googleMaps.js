const axios = require('axios');

const axios = require('axios');

function formatCoord(location) {
    if (typeof location === 'object' && location.lat && location.lng) {
        return `${location.lat},${location.lng}`;
    }
    return location; // Return as string (address)
}

async function getDistanceMatrix(pickup, drop) {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) throw new Error('Google Maps API Key missing');

        const originStr = formatCoord(pickup);
        const destStr = formatCoord(drop);

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
        const params = {
            origins: originStr,
            destinations: destStr,
            key: apiKey
        };

        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Google Maps API Error: ${data.status}`);
        }

        const element = data.rows[0].elements[0];
        if (element.status !== 'OK') {
            throw new Error(`Route not found: ${element.status}`);
        }

        const distanceKm = element.distance.value / 1000;
        const durationMin = Math.round(element.duration.value / 60);

        return { distanceKm, durationMin };
    } catch (error) {
        console.error('Google Maps Service Error:', error.message);
        throw error;
    }
}

module.exports = { getDistanceMatrix };

module.exports = { getDistanceMatrix };
