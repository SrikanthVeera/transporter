const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/ride/estimate
router.get('/estimate', async (req, res) => {
    const { pickup, drop } = req.query; // format: "lat,lng"
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!pickup || !drop || !apiKey) return res.status(400).json({ error: 'Invalid parameters' });

    try {
        // 1. Google Distance Matrix
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: pickup,
                destinations: drop,
                mode: 'driving',
                departure_time: 'now', // Traffic aware
                key: apiKey
            }
        });

        if (response.data.status !== 'OK') throw new Error('Google API Error');

        const element = response.data.rows[0].elements[0];
        if (element.status !== 'OK') throw new Error('Route not found');

        const distKm = element.distance.value / 1000;
        const durationMins = element.duration_in_traffic ? (element.duration_in_traffic.value / 60) : (element.duration.value / 60);

        // 2. Real Price Calculation
        const estimates = [
            { type: 'AUTO', base: 30, rateKm: 15, rateTime: 0 },
            { type: 'MINI', base: 50, rateKm: 12, rateTime: 1.5 },
            { type: 'PRIME', base: 80, rateKm: 18, rateTime: 2.0 }
        ].map(vehicle => {
            let price = vehicle.base + (distKm * vehicle.rateKm) + (durationMins * vehicle.rateTime);
            return {
                type: vehicle.type,
                price: Math.round(price),
                distance: element.distance.text,
                duration: element.duration_in_traffic ? element.duration_in_traffic.text : element.duration.text
            };
        });

        res.json({ estimates });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Estimation failed' });
    }
});

module.exports = router;
