import React, { useState } from 'react';
import { Navigation, Clock, Car, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocationService } from '../hooks/useLocationService';
import autoImg from '../assets/auto1.jpg';
import carImg from '../assets/car1.jpg';
import truckImg from '../assets/truck1.jpg';

// NOTE: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const BookingWidget = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('daily');
    const {
        pickup, setPickup,
        drop, setDrop,
        pickupCoords, setPickupCoords,
        dropCoords, setDropCoords,
        isLocating, detectLocation,
        pickupInputRef, dropInputRef
    } = useLocationService();

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-md mx-auto relative z-10 shadow-xl shadow-purple-900/5 rounded-[24px] p-6">


            <h2 className="text-2xl font-heading font-bold mb-6 text-gray-900">
                Where to?
            </h2>

            {/* Inputs */}
            <div className="space-y-4 relative">
                <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-gray-200"></div>

                {/* Pickup Input */}
                <div className="relative group z-30">
                    <div className="absolute left-3 top-3.5 text-purple-600">
                        <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow-sm"></div>
                    </div>
                    <input
                        ref={pickupInputRef}
                        type="text"
                        placeholder="Current Location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent hover:border-gray-200 focus:border-purple-500 rounded-xl py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-body"
                    />
                    <button
                        onClick={detectLocation}
                        className={`absolute right-3 top-3 p-1 hover:bg-gray-200 rounded-full transition-colors ${isLocating ? 'animate-spin text-purple-600' : 'text-gray-500'}`}
                        title="Use Current Location"
                    >
                        <Navigation size={14} fill={isLocating ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Drop Input */}
                <div className="relative group z-20">
                    <div className="absolute left-3 top-3.5 text-black">
                        <div className="w-3 h-3 bg-black/80 rotate-45 border-2 border-white shadow-sm"></div>
                    </div>
                    <input
                        ref={dropInputRef}
                        type="text"
                        placeholder="Enter Destination"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent hover:border-gray-200 focus:border-black rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-body"
                    />
                </div>
            </div>

            {/* Options */}
            <div className="flex gap-3 mt-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
                <button className="flex items-center gap-2 bg-gray-50 border border-transparent px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
                    <Clock size={14} /> <span>Now</span>
                </button>
                <button className="flex items-center gap-2 bg-gray-50 border border-transparent px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
                    For Me
                </button>
            </div>

            {/* Search Button */}
            <button
                onClick={() => navigate('/rides', { state: { pickup, drop } })}
                className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-purple-500/20"
                disabled={!pickup || !drop}
            >
                Search Vibes
            </button>

            {/* Quick Vehicles Preview */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                    { image: carImg, label: 'Car', color: 'text-gray-400 hover:text-purple-600' },
                    { image: truckImg, label: 'Truck', color: 'text-gray-400 hover:text-purple-900' },
                    { image: autoImg, label: 'Auto', color: 'text-gray-400 hover:text-green-600' }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate('/rides')}
                        className={`flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 group ${item.color}`}
                    >
                        <img src={item.image} alt={item.label} className="w-32 h-20 object-contain" />
                        <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingWidget;
