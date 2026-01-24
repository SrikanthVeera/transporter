const mapsService = require('../services/googleMaps');

exports.calculate = async (req, res) => {
    try {
        const { pickup, drop } = req.body;

        // Validation: Ensure valid objects or strings
        if (!pickup || !drop) {
            return res.status(400).json({ error: 'Pickup and drop locations required' });
        }

        const { distanceKm, durationMin } = await mapsService.getDistanceMatrix(pickup, drop);

        res.json({
            distance: distanceKm,
            duration: durationMin
        });
    } catch (error) {
        console.error("Location Controller Error:", error.message);
        res.status(500).json({ error: error.message || "Failed to calculate location" });
    }
};
