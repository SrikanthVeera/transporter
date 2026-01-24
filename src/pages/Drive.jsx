import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, DollarSign, Clock, Shield, MapPin, Smartphone, Info, Mail, Lock, User } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../services/firebase';

const Drive = () => {
    // Auth State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(false); // Default to Sign Up
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUpToDrive = () => {
        setIsLoginMode(false);
        setShowLoginModal(true);
    };

    const handleAuth = async () => {
        if (!email || !password) {
            setAuthError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setAuthError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setAuthError('');

        try {
            let userCredential;
            if (isLoginMode) {
                // Login
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                // Sign Up
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
            console.log("Driver Auth Success:", user.uid);

            // Close modal
            setShowLoginModal(false);

            // Redirect logic
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (/android/i.test(userAgent)) {
                window.location.href = "https://play.google.com/store/apps/details?id=com.transporter.driver";
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                window.location.href = "https://apps.apple.com/in/app/transporter-driver/id6755738682";
            } else {
                window.location.href = "https://play.google.com/store/apps/details?id=com.transporter.driver";
            }

        } catch (error) {
            console.error("Driver Auth Error:", error);
            let msg = "Authentication failed.";
            if (error.code === 'auth/email-already-in-use') msg = "Email already in use. Please login.";
            if (error.code === 'auth/wrong-password') msg = "Invalid password.";
            if (error.code === 'auth/user-not-found') msg = "No driver account found with this email.";
            if (error.code === 'auth/invalid-email') msg = "Invalid email address.";
            setAuthError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative min-h-screen w-full flex items-center pt-20 pb-20 overflow-hidden bg-white">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/4"></div>

                <div className="w-full px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl mx-auto">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                            Join India's Fastest Growing Fleet
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight text-slate-900">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Drive with</span> <br />
                            Transporter
                        </h1>

                        <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                            Be your own boss. Earn more with zero commission on your first 100 rides.
                            Flexible hours, instant payouts, and 24/7 support.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 font-bold">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold leading-none text-slate-900">Zero Commission</h4>
                                    <span className="text-xs text-slate-500">First 100 rides</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 font-bold">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold leading-none text-slate-900">Flexible Hours</h4>
                                    <span className="text-xs text-slate-500">Work when you want</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Benefits Widget / Right Side */}
                    <div className="relative">
                        {/* Decorative Floaties */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-100 rounded-2xl rotate-12 opacity-60"></div>
                        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-50 rounded-full opacity-60"></div>

                        <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Driver Benefits</h3>
                                <p className="text-slate-500 text-sm">Start earning with Transporter</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-purple-600">₹35,000+</div>
                                        <div className="text-xs text-slate-600">Average Monthly Earnings</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-purple-600">24/7</div>
                                        <div className="text-xs text-slate-600">Flexible Working Hours</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Shield className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-purple-600">100%</div>
                                        <div className="text-xs text-slate-600">Safety & Insurance</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSignUpToDrive}
                                className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                            >
                                Sign Up to Drive
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Why Drive with Us?</h2>
                        <p className="text-gray-500 text-lg">We put our partners first. Experience the difference with Transporter.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: DollarSign, title: "Zero Commission", desc: "Keep 100% of what you earn during promotional periods. Low commission thereafter." },
                            { icon: Clock, title: "Flexible Schedule", desc: "You decide when and how long you want to drive. No minimum hours required." },
                            { icon: Shield, title: "Safety First", desc: "24/7 designated support line and in-app emergency button for your safety." },
                            { icon: Smartphone, title: "Easy App", desc: "Navigate easily with our driver-friendly app. See earnings in real-time." },
                            { icon: MapPin, title: "High Demand", desc: "Get more rides with our growing user base in top cities across the country." },
                            { icon: CheckCircle, title: "Insurance Cover", desc: "Comprehensive accidental insurance coverage for you and your family." },
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-20 bg-purple-900 text-white">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-6">How to get started?</h2>
                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Sign Up Online", desc: "Fill out a simple form with your basic details and vehicle information." },
                                    { step: "02", title: "Upload Documents", desc: "Upload your driving license, vehicle registration, and ID proof." },
                                    { step: "03", title: "Get Verified", desc: "Our team will verify your documents within 24 hours." },
                                    { step: "04", title: "Start Driving", desc: "Download the driver app, log in, and start accepting rides!" }
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-bold text-white font-heading text-xl">
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                                            <p className="text-purple-200">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            {/* Placeholder for an image or app screenshot */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <Smartphone size={64} className="mx-auto mb-4 opacity-50 text-purple-200" />
                                    <p>Driver App Interface</p>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Download our apps to get the best experience</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Start your journey as a driver or book rides with our mobile apps</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Customer App */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">T</span>
                                    </div>
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
                                <button className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                    App Store
                                </button>
                                <button className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Google Play
                                </button>
                            </div>
                        </div>

                        {/* Driver App */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center relative">
                                        <span className="text-white font-bold text-sm">T</span>
                                        <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-xs px-1 rounded">
                                            DRIVER
                                        </div>
                                    </div>
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
                                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                                    App Store
                                </button>
                                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                                    Google Play
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Login / Auth Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/20 backdrop-blur-sm p-4 w-full h-full">
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
                                    {isLoginMode ? 'Welcome Back, Driver' : 'Become a Driver'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isLoginMode ? 'Log in to access your dashboard' : 'Join India\'s best driver community'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {authError && (
                                    <p className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded flex items-center gap-2">
                                        <Info size={14} /> {authError}
                                    </p>
                                )}

                                <button
                                    onClick={handleAuth}
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white rounded-lg py-3.5 font-bold text-sm shadow-lg hover:bg-purple-700 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : (isLoginMode ? 'Login to Dashboard' : 'Sign Up & Drive')}
                                </button>

                                <div className="text-center mt-2">
                                    <button
                                        onClick={() => {
                                            setIsLoginMode(!isLoginMode);
                                            setAuthError('');
                                        }}
                                        className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                                    >
                                        {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Drive;
