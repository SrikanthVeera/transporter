const express = require('express');
const router = express.Router();
const axios = require('axios');

// Pricing Rules
const PRICING = {
    auto: { base: 30, perKm: 12, perMin: 1 },
    car: { base: 50, perKm: 15, perMin: 2 },
    premium: { base: 80, perKm: 20, perMin: 3 }
};

// Helper: Calculate Price
const calculatePrice = (distanceKm, durationMin, type) => {
    const rules = PRICING[type] || PRICING.car; // Default to car
    const distanceCost = distanceKm * rules.perKm;
    const timeCost = durationMin * rules.perMin;
    const total = Math.round(rules.base + distanceCost + timeCost);

    return {
        base: rules.base,
        distance_cost: Math.round(distanceCost),
        time_cost: Math.round(timeCost),
        total: total
    };
};

// GET /api/ride/estimate
router.get('/estimate', async (req, res) => {
    try {
        const { pickupLat, pickupLng, dropLat, dropLng, vehicleType } = req.query;

        if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
            return res.status(400).json({ error: 'Pickup and Drop coordinates required' });
        }

        const origin = `${pickupLat},${pickupLng}`;
        const destination = `${dropLat},${dropLng}`;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        // 1. Call Google Distance Matrix API
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK' || !data.rows[0].elements[0].distance) {
            return res.status(500).json({ error: 'Failed to calculate distance' });
        }

        const element = data.rows[0].elements[0];
        const distanceMetres = element.distance.value;
        const durationSeconds = element.duration.value;

        const distanceKm = distanceMetres / 1000;
        const durationMin = durationSeconds / 60;

        // 2. Calculate Price
        const priceDetails = calculatePrice(distanceKm, durationMin, vehicleType);

        res.json({
            success: true,
            distance_km: distanceKm.toFixed(2),
            duration_min: Math.round(durationMin),
            estimated_price: priceDetails.total,
            breakdown: priceDetails
        });

    } catch (error) {
        console.error('Ride Estimate Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
