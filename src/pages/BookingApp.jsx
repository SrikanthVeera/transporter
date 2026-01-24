import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { getRideEstimate } from '../services/api';
import { initSocket, getSocket } from '../services/socket';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 12.9716, // Bangalore default
    lng: 77.5946
};

const BookingApp = () => {
    // 1. Map State
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const [map, setMap] = useState(null);
    const [pickup, setPickup] = useState(null); // { lat, lng }
    const [drop, setDrop] = useState(null);

    // 2. Data State
    const [estimates, setEstimates] = useState(null);
    const [selectedRide, setSelectedRide] = useState(null);
    const [driverLoc, setDriverLoc] = useState(null); // Live driver tracking

    // 3. Socket Connection
    useEffect(() => {
        const socket = initSocket();
        if (socket) {
            socket.on('driver_location_update', (data) => {
                console.log("Create Live Driver Marker:", data);
                setDriverLoc({ lat: data.lat, lng: data.lng });
            });
        }
        return () => {
            if (socket) socket.off('driver_location_update');
        };
    }, []);

    // 4. Handle Price Estimate
    const calculateFare = async () => {
        if (!pickup || !drop) return alert("Select Pickup & Drop points on map");

        try {
            const res = await getRideEstimate(
                { pickupLat: pickup.lat, pickupLng: pickup.lng },
                { dropLat: drop.lat, dropLng: drop.lng },
                'car' // getting car as pivot, but API could return all ideally.
                // For this demo, let's assume we fetch estimates for one and calculated others or backend returns all.
                // The current backend returns one. We can modify backend or just ping once for now.
            );
            setEstimates(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to get estimate");
        }
    };

    // 5. Map Interactions
    const onMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (!pickup) setPickup({ lat, lng });
        else if (!drop) setDrop({ lat, lng });
        else {
            // Reset if both set
            setPickup({ lat, lng });
            setDrop(null);
            setEstimates(null);
        }
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div className="flex h-screen">
            {/* Left Panel: Controls & Price */}
            <div className="w-1/3 bg-white p-6 shadow-xl z-10 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Book a Ride</h1>

                <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="font-semibold">{pickup ? `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}` : 'Click on Map'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-xs text-gray-500">Drop</p>
                        <p className="font-semibold">{drop ? `${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}` : 'Click on Map'}</p>
                    </div>

                    <button
                        onClick={calculateFare}
                        disabled={!pickup || !drop}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold disabled:bg-gray-300"
                    >
                        Get Price Estimate
                    </button>
                </div>

                {estimates && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-2">Available Rides</h3>
                        <div className="space-y-3">
                            {/* Estimated Display based on backend response */}
                            <div className="p-4 border rounded-lg hover:border-black cursor-pointer flex justify-between items-center bg-gray-50">
                                <div>
                                    <h4 className="font-bold">Standard Car</h4>
                                    <p className="text-sm text-gray-500">{estimates.duration_min} mins • {estimates.distance_km} km</p>
                                </div>
                                <div className="text-xl font-bold">₹{estimates.estimated_price}</div>
                            </div>
                        </div>
                        <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                            Book Now
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel: Map */}
            <div className="w-2/3">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={pickup || center}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={onMapClick}
                >
                    {/* Pickup Marker */}
                    {pickup && <Marker position={pickup} label="P" />}

                    {/* Drop Marker */}
                    {drop && <Marker position={drop} label="D" />}

                    {/* Live Driver Marker */}
                    {driverLoc && (
                        <Marker
                            position={driverLoc}
                            icon={{
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                scale: 6,
                                fillColor: "black",
                                fillOpacity: 1,
                                strokeWeight: 2,
                                rotation: driverLoc.heading || 0
                            }}
                        />
                    )}

                    {/* Route Polyline (Simple straight line for demo, DirectionsService needed for real road match) */}
                    {pickup && drop && (
                        <Polyline
                            path={[pickup, drop]}
                            options={{ strokeColor: "#000000", strokeWeight: 4 }}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default BookingApp;
