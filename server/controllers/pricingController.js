exports.calculatePrice = (req, res) => {
    try {
        const { distance } = req.body;

        if (distance === undefined || distance === null) {
            return res.status(400).json({ error: 'Distance is required' });
        }

        const distVal = parseFloat(distance);
        if (isNaN(distVal)) {
            return res.status(400).json({ error: 'Invalid distance format' });
        }

        // Pricing Rules
        // Auto: 20 INR per KM
        // Car: 30 INR per KM
        const priceAuto = Math.round(distVal * 20);
        const priceCar = Math.round(distVal * 30);

        res.json({
            auto: priceAuto,
            car: priceCar
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
