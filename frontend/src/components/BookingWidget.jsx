import React, { useState } from 'react';
import { Navigation, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocationService } from '../hooks/useLocationService';
import autoImg from '../assets/auto1.jpg';
import carImg from '../assets/car1.jpg';
import truckImg from '../assets/truck2.png';

const BookingWidget = () => {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState('auto'); // 'auto' | 'car' | 'truck' | 'outstation'

    const {
        pickup, setPickup,
        drop, setDrop,
        detectLocation,
        pickupInputRef, dropInputRef,
        isLocating
    } = useLocationService();

    const handleContinue = () => {
        if (!pickup || !drop) return;
        navigate('/ride', {
            state: {
                pickup,
                drop,
                serviceType: selectedMode // Pass this to pre-filter the list
            }
        });
    };

    return (

        <div className="w-full md:max-w-[420px] mx-auto relative z-10 font-sans">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">

                {/* Top Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                <div className="p-6 pb-2">
                    <h2 className="text-2xl font-black mb-5 text-gray-900 tracking-tight">
                        Where to?
                    </h2>

                    <div className="space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[22px] top-10 bottom-10 w-[2px] bg-gray-100 z-0"></div>

                        {/* Pickup Input */}
                        <div className="relative z-10 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1">
                                <div className="w-3.5 h-3.5 rounded-full border-[3px] border-black bg-white shadow-sm ring-4 ring-transparent group-focus-within:ring-purple-50 transition-all"></div>
                            </div>
                            <input
                                ref={pickupInputRef}
                                type="text"
                                placeholder="Pickup Point"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white border-0 rounded-2xl py-4 pl-12 pr-12 text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-base shadow-sm"
                            />
                            <button
                                onClick={detectLocation}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors ${isLocating ? 'animate-spin text-black' : 'text-gray-400 hover:text-black'}`}
                                title="Use current location"
                            >
                                <Navigation size={18} fill={isLocating ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Drop Input */}
                        <div className="relative z-10 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-1">
                                <div className="w-3.5 h-3.5 bg-black rounded-sm shadow-sm ring-4 ring-transparent group-focus-within:ring-purple-50 transition-all"></div>
                            </div>
                            <input
                                ref={dropInputRef}
                                type="text"
                                placeholder="Drop off Location"
                                value={drop}
                                onChange={(e) => setDrop(e.target.value)}
                                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white border-0 rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all text-base shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Divider/Spacer */}
                <div className="h-px bg-gray-100 mx-6 my-2"></div>

                <div className="p-6 pt-2">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        Select Vehicle Type
                    </h3>

                    {/* 2x2 Grid Layout */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { id: 'auto', label: 'Auto', img: autoImg, sub: '2-3 people' },
                            { id: 'car', label: 'Car', img: carImg, popular: true, sub: '2-4 passengers' },
                            { id: 'truck', label: 'Truck', img: truckImg, sub: '0-10 loads' },
                            { id: 'outstation', label: 'Outstation', img: carImg, sub: 'Out of City' },
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedMode(type.id)}
                                className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 transition-all duration-300 h-32 w-full group overflow-hidden
                                    ${selectedMode === type.id
                                        ? 'bg-purple-50/50 border-purple-600 ring-0 shadow-md transform scale-[1.02]'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'}`}
                            >
                                {/* Popular Badge */}
                                {type.popular && (
                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-wide">
                                        Popular
                                    </div>
                                )}

                                {/* Selected Checkmark */}
                                {selectedMode === type.id && (
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 shadow-sm z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}

                                <div className="w-full h-14 flex items-center justify-center mb-1 mt-3">
                                    <img
                                        src={type.img}
                                        alt={type.label}
                                        className={`h-full w-auto object-contain drop-shadow-sm transition-transform duration-500 ${selectedMode === type.id ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                </div>

                                <div className="text-center space-y-0.5 z-10">
                                    <span className={`text-base font-black tracking-tight block ${selectedMode === type.id ? 'text-purple-900' : 'text-gray-900'}`}>
                                        {type.label}
                                    </span>
                                    <span className={`text-[10px] font-bold block tracking-wide uppercase ${selectedMode === type.id ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {type.sub}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleContinue}
                        className={`w-full py-4 rounded-2xl text-lg font-black tracking-tight shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group
                            ${pickup && drop
                                ? 'bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
                        disabled={!pickup || !drop}
                    >
                        <span className="relative z-10">See prices</span>
                        <ArrowRight size={22} className={`relative z-10 transition-transform duration-300 ${pickup && drop ? "text-purple-300 group-hover:translate-x-1" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default BookingWidget;
