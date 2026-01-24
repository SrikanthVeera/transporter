import { useState, useEffect, useRef } from 'react';

/**
 * useLocationService Hook
 * 
 * Centralizes Google Maps Autocomplete and Geolocation logic
 * for reuse across Home Page (BookingWidget) and Customer Page (RideSelection).
 */
export const useLocationService = (initialPickup = '', initialDrop = '') => {
    const [pickup, setPickup] = useState(initialPickup);
    const [drop, setDrop] = useState(initialDrop);

    // Storing coordinates for potential future use (e.g. precise routing)
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);

    const [isLocating, setIsLocating] = useState(false);

    const pickupInputRef = useRef(null);
    const dropInputRef = useRef(null);
    const pickupAutocompleteRef = useRef(null);
    const dropAutocompleteRef = useRef(null);

    // FIX: Ensure Google Places dropdown is visible above high z-index modals/sheets
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .pac-container {
                z-index: 9999999 !important; /* Ensure it appears above everything */
                font-family: 'Inter', sans-serif; /* Match app font */
                border-radius: 12px;
                margin-top: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                border: 1px solid rgba(0,0,0,0.05); /* Subtle border */
                background-color: white;
                overflow: hidden; /* rounded corners fix */
            }
            .pac-item {
                padding: 14px 16px;
                cursor: pointer;
                font-size: 15px;
                color: #374151; /* gray-700 */
                border-top: 1px solid #f3f4f6;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .pac-item:first-child {
                border-top: none;
            }
            .pac-item:hover {
                background-color: #f9fafb; /* gray-50 */
            }
            .pac-item-query {
                font-size: 15px;
                color: #111827; /* gray-900 */
                font-weight: 600;
                padding-right: 4px;
            }
            .pac-icon {
                margin-top: 0;
                width: 18px;
                height: 18px;
                opacity: 0.5;
            }
            .hdpi .pac-icon {
                transform: scale(0.8); /* Adjust icon size */
            }
        `;
        document.head.appendChild(style);
        return () => {
            // Check if style still exists before removing to prevent errors
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Initialize Autocomplete
    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;

        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };

        // Pickup Autocomplete
        if (pickupInputRef.current) {
            // Check if already initialized to prevent double-binding
            if (!pickupAutocompleteRef.current) {
                pickupAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                    pickupInputRef.current,
                    options
                );
                pickupAutocompleteRef.current.addListener("place_changed", () => {
                    const place = pickupAutocompleteRef.current.getPlace();
                    if (place.geometry) {
                        setPickup(place.formatted_address || place.name);
                        setPickupCoords({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        });
                    }
                });
            }
        }

        // Drop Autocomplete
        if (dropInputRef.current) {
            if (!dropAutocompleteRef.current) {
                dropAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                    dropInputRef.current,
                    options
                );
                dropAutocompleteRef.current.addListener("place_changed", () => {
                    const place = dropAutocompleteRef.current.getPlace();
                    if (place.geometry) {
                        setDrop(place.formatted_address || place.name);
                        setDropCoords({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        });
                    }
                });
            }
        }
    }, [pickupInputRef.current, dropInputRef.current]);

    // Detect Current Location Logic
    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        if (!window.google) {
            alert('Google Maps API is not loaded yet.');
            return;
        }

        setIsLocating(true);
        // Temporary placeholder to indicate activity
        if (!pickup) setPickup("Detecting location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const geocoder = new window.google.maps.Geocoder();
                const latlng = { lat: latitude, lng: longitude };

                geocoder.geocode({ location: latlng }, (results, status) => {
                    setIsLocating(false);
                    if (status === "OK" && results[0]) {
                        const address = results[0].formatted_address;
                        setPickup(address);
                        setPickupCoords(latlng);

                        // Bias the autocomplete to this location if it exists
                        if (pickupAutocompleteRef.current) {
                            // Create bounds around the current location
                            const circle = new window.google.maps.Circle({
                                center: latlng,
                                radius: 5000, // 5km radius bias
                            });
                            pickupAutocompleteRef.current.setBounds(circle.getBounds());
                        }
                    } else {
                        console.error("Geocoder failed due to: " + status);
                        setPickup("Current Location (Lat/Lng)");
                        setPickupCoords(latlng);
                    }
                });
            },
            (error) => {
                setIsLocating(false);
                console.error("Error detecting location:", error);

                // Only alert if we don't have a value yet (silent fail if user just cancels)
                if (pickup === "Detecting location...") {
                    setPickup(""); // Reset
                    alert('Unable to retrieve your location');
                }
            }
        );
    };

    return {
        pickup,
        setPickup,
        drop,
        setDrop,
        pickupCoords,
        setPickupCoords,
        dropCoords,
        setDropCoords,
        isLocating,
        detectLocation,
        pickupInputRef,
        dropInputRef
    };
};
