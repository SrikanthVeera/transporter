const express = require('express');
const router = express.Router();
const db = require('../database/db');
const axios = require('axios');

// POST /api/location/update
router.post('/update', async (req, res) => {
    const { userId, latitude, longitude, accuracy } = req.body;

    // In production, get userId from JWT Middleware (req.user.id)
    if (!latitude || !longitude) return res.status(400).json({ error: 'Coordinates missing' });

    try {
        // Log location (simplified table structure)
        // await db.query('INSERT INTO location_history ...');
        console.log(`[Location] User ${userId || 'Anon'}: ${latitude}, ${longitude}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update location' });
    }
});

// POST /api/location/calculate
router.post('/calculate', async (req, res) => {
    const { pickup, drop } = req.body;

    // Mock distance calculation for now (since we might not have Mapbox/Google set up)
    // In a real app, you would use Google Distance Matrix API here

    // Random distance between 2km and 15km
    const distance = (Math.random() * 13 + 2).toFixed(1);

    // Simulate delay
    await new Promise(r => setTimeout(r, 500));

    res.json({
        distance: distance,
        duration: Math.round(distance * 3) + ' mins'
    });
});

// GET /api/location/autocomplete
router.get('/autocomplete', async (req, res) => {
    const { input, lat, lng } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!input || !apiKey) return res.status(400).json({ error: 'Missing input or API key' });

    try {
        // Bias results to user location (50km radius)
        const locationBias = (lat && lng) ? `circle:50000@${lat},${lng}` : undefined;

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input,
                key: apiKey,
                types: 'geocode',
                locationbias: locationBias
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Google API Error' });
    }
});

module.exports = router;
