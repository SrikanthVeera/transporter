import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Info, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { auth, signInWithCustomToken } from '../services/firebase';
import { verifyOtp as apiVerifyOtp, sendOtp as apiSendOtp } from '../services/api';
import driverImg from '../assets/driver1.png';
import autoImg from '../assets/auto1.jpg';
import carImg from '../assets/car1.jpg';
import truckImg from '../assets/truck2.png';
import customerAppImg from '../assets/playstorecustomer.png';
import driverAppImg from '../assets/playstoredriver.png';
import liveTrackingImg from '../assets/livetracking.png';

const Drive = () => {
    // Auth State (OTP Flow)
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUpToDrive = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsOtpSent(false);
        setMobile('');
        setOtp('');
        setLoginError('');
        setShowLoginModal(true);
    };

    const handleSendOtp = async () => {
        if (!mobile || mobile.length !== 10) {
            setLoginError("Please enter a valid 10-digit mobile number.");
            return;
        }

        setLoading(true);
        setLoginError("");

        try {
            const formattedMobile = `+91${mobile}`;
            await apiSendOtp(formattedMobile);
            setIsOtpSent(true);
            console.log("OTP sent via Backend/Fast2SMS");
        } catch (error) {
            console.error("Send OTP failed:", error);
            setLoginError(error.response?.data?.error || error.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            if (!isOtpSent) throw new Error("Please request OTP first");

            const formattedMobile = `+91${mobile}`;

            const response = await apiVerifyOtp(formattedMobile, otp);
            const { token, firebaseToken, user, success } = response.data;

            if (!success || !firebaseToken) {
                throw new Error(response.data?.error || "OTP verification failed");
            }

            await signInWithCustomToken(auth, firebaseToken);
            console.log("Firebase Custom Auth Successful");

            setShowLoginModal(false);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to PARTNER App Logic
            window.location.href = "https://play.google.com/store/apps/details?id=com.transporterpartner";

        } catch (error) {
            console.error(error);
            setLoginError(error.response?.data?.error || error.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section - Mobile Optimized */}
            <div className="relative min-h-[auto] md:min-h-[85vh] w-full bg-slate-50 overflow-hidden flex flex-col md:flex-row">

                {/* Left Content */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-16 relative z-20 pt-28 md:pt-16">
                    <div className="max-w-xl space-y-6 md:space-y-8 text-center md:text-left">
                        <div className="inline-block">
                            <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1.5 rounded-full text-xs md:text-sm tracking-wide border border-orange-200">
                                🚀 Hiring in 25+ Cities
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-slate-900 leading-tight">
                            Turn <br />
                            <span className="text-purple-600 relative">
                                Kilometers
                                <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-purple-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                            </span> <br />
                            Into Cash.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed px-2 md:px-0">
                            Zero joining fees. Instant payouts. <br className="hidden md:block" />
                            The freedom to earn is just a ride away.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                            <button
                                onClick={handleSignUpToDrive}
                                className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                Become a Captain
                                <div className="bg-white/20 rounded-full p-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Image Side */}
                <div className="w-full md:w-1/2 relative h-[45vh] md:h-auto bg-purple-600 mt-8 md:mt-0">
                    <img
                        src={driverImg}
                        alt="Transporter Captain"
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
                    />
                    {/* Creative Connector */}
                    <div className="absolute -top-1 left-0 w-full h-16 bg-slate-50 z-10 block md:hidden" style={{ clipPath: 'ellipse(50% 60% at 50% 0%)' }}></div>
                    <div className="absolute top-0 left-0 w-16 h-full bg-slate-50 z-10 hidden md:block" style={{ clipPath: 'ellipse(60% 50% at 0% 50%)' }}></div>
                </div>
            </div>

            {/* Make Money / Vehicle Selection Section */}
            <div className="py-16 md:py-24 bg-white relative">
                <div className="container px-4 md:px-6">
                    <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 leading-tight">
                            Attach your <span className="text-purple-600">Auto, Car, or Truck</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                            Apply now to become a Transporter driver-partner. Start earning in 24 hours!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {/* Auto Card */}
                        <div className="group relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-white -z-10 group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Attach Auto</h3>
                                <p className="text-slate-500 text-sm mb-6">Earn up to ₹35,000/month</p>
                                <div className="h-40 md:h-48 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-yellow-100 rounded-full blur-2xl opacity-60 scale-75 group-hover:scale-100 transition-all"></div>
                                    <img src={autoImg} alt="Auto" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSignUpToDrive}
                                    className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 transition-colors"
                                >
                                    Register Auto <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Car Card */}
                        <div className="group relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white -z-10 group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Attach Car</h3>
                                <p className="text-slate-500 text-sm mb-6">Earn up to ₹55,000/month</p>
                                <div className="h-48 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-purple-100 rounded-full blur-2xl opacity-60 scale-75 group-hover:scale-100 transition-all"></div>
                                    <img src={carImg} alt="Car" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSignUpToDrive}
                                    className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 transition-colors"
                                >
                                    Register Car <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Truck Card */}
                        <div className="group relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10 group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Attach Truck</h3>
                                <p className="text-slate-500 text-sm mb-6">Earn up to ₹70,000/month</p>
                                <div className="h-48 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-60 scale-75 group-hover:scale-100 transition-all"></div>
                                    <img src={truckImg} alt="Truck" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSignUpToDrive}
                                    className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 transition-colors"
                                >
                                    Turn Miles to Money <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Why Drivers Love Transporter</h2>
                        <p className="text-gray-500 text-lg">We put our partners first. Experience the difference with Transporter.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { img: "https://placehold.co/200x200/f3e8ff/9333ea?text=Zero+Comm", title: "Zero Commission", desc: "Just recharge a nominal fee everyday and Keep 100% of what you earn. We take 0%." },
                            { img: "https://placehold.co/200x200/f3e8ff/9333ea?text=Flexible", title: "Flexible Schedule", desc: "You decide when and how long you want to drive. No minimum hours required." },
                            { img: "https://placehold.co/200x200/f3e8ff/9333ea?text=Insurance", title: "Insurance Cover", desc: "Comprehensive accidental insurance coverage for you and your family." },
                            { img: "https://placehold.co/200x200/f3e8ff/9333ea?text=Payouts", title: "Instant Payouts", desc: "Earn money by delivering passengers, goods, and packages." },
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-6 group-hover:scale-110 transition-transform">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-contain drop-shadow-md rounded-xl"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={handleSignUpToDrive}
                            className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all inline-flex items-center gap-3"
                        >
                            Become a Captain
                            <div className="bg-white/20 rounded-full p-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Steps Section - How to get started */}
            <div className="py-24 bg-white relative overflow-hidden">
                <div className="container px-4">
                    <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="order-2 md:order-1 relative">
                            {/* Abstract Background Element */}
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                            <h2 className="text-4xl font-heading font-black text-slate-900 mb-8 relative z-10">
                                How to get started?
                            </h2>
                            <div className="space-y-10 relative z-10">
                                {[
                                    { step: "01", title: "Sign Up Online", desc: "Fill out a simple form with your basic details and vehicle information." },
                                    { step: "02", title: "Upload Documents", desc: "Upload your driving license, vehicle registration, and ID proof." },
                                    { step: "03", title: "Get Verified", desc: "Our team will verify your documents within 24 hours." },
                                    { step: "04", title: "Start Driving", desc: "Download the driver app, log in, and start accepting rides!" }
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-100 flex items-center justify-center font-bold text-purple-600 text-xl shadow-sm group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                                {s.step}
                                            </div>
                                            {i !== 3 && <div className="absolute top-14 left-7 h-10 w-0.5 bg-purple-100 -bottom-6 -z-10 group-hover:bg-purple-200 transition-colors"></div>}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h4>
                                            <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 md:order-2 relative h-[500px] md:h-[650px] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl group">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent"></div>

                            {/* Ride App Check */}
                            <img
                                src={liveTrackingImg}
                                alt="Driver App Interface"
                                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />

                            {/* Overlay Gradient for Text Readability if needed, but here we want the clear UI */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                                    <h3 className="text-xl font-bold mb-1">Live Navigation</h3>
                                    <p className="text-sm text-gray-200">Real-time traffic updates and optimal routes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Download Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get to your destination at the best price?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of Indians choosing fair prices and reliable rides. Download Transporter Today.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Customer App */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                                    <img src={customerAppImg} alt="Transporter Customer App" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-purple-600 group-hover:translate-x-2 transition-transform">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Transporter</h3>
                            <p className="text-gray-600 text-sm mb-6">Book rides, track your journey, and enjoy seamless transportation</p>
                            <div className="flex gap-3">
                                <a
                                    href="https://apps.apple.com/in/app/transporter-customer/id6755738681"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                                >
                                    App Store
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.transporter.customer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                                >
                                    Google Play
                                </a>
                            </div>
                        </div>

                        {/* Driver App */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                                    <img src={driverAppImg} alt="Transporter Driver App" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-purple-600 group-hover:translate-x-2 transition-transform">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Transporter Driver</h3>
                            <p className="text-gray-600 text-sm mb-6">Register as a driver, accept rides, and start earning with flexible hours</p>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                                >
                                    App Store
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.transporterpartner"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                                >
                                    Google Play
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Login / Auth Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-900/20 backdrop-blur-sm p-4 w-full h-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isOtpSent ? 'Enter Verification Code' : 'Partner Login'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isOtpSent ? `Sent to +91 ${mobile}` : 'Enter your mobile number to start earning.'}
                                </p>
                            </div>

                            <div className="space-y-5">
                                {!isOtpSent ? (
                                    <div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-300 pr-3">
                                                <span className="text-sm font-bold text-gray-700">IN</span>
                                                <span className="text-sm font-medium text-gray-500">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength="10"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-28 pr-4 py-3.5 text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                                placeholder="00000 00000"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full text-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-2xl font-bold text-gray-900 tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                            placeholder="······"
                                            autoFocus
                                        />
                                        <div className="flex justify-between items-center mt-3 px-1">
                                            <button
                                                onClick={() => { setIsOtpSent(false); setOtp(''); setLoginError(''); }}
                                                className="text-xs text-gray-500 hover:text-purple-600 font-medium"
                                            >
                                                Change Number
                                            </button>
                                            <button className="text-xs text-gray-500 hover:text-purple-600 font-medium">
                                                Resend Code
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {loginError && (
                                    <p className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded flex items-center gap-2">
                                        <Info size={14} /> {loginError}
                                    </p>
                                )}

                                <button
                                    onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white rounded-lg py-3.5 font-bold text-base shadow-lg hover:bg-purple-700 transform transition-all active:scale-[0.98]"
                                >
                                    {loading ? 'Processing...' : (isOtpSent ? 'Verify & Download' : 'Continue')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Drive;
