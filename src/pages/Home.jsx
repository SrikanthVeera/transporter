import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Shield, Smartphone, Map, CreditCard, Star, Clock, CheckCircle, Car, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default"
    >
        <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-600 transition-colors flex items-center justify-center mb-6">
            <Icon className="text-purple-600 group-hover:text-white transition-colors" size={28} />
        </div>
        <h3 className="text-xl font-heading font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

const Home = () => {
    return (
        <div className="min-h-screen w-full bg-white">
            <Navbar />
            <Hero />

            {/* Services/Features Section - LIGHT GRAY BG */}
            <section className="py-24 relative bg-slate-50 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                            Why Choose <span className="text-purple-600">Transporter?</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            We're not just moving people; we're moving the world forward.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <FeatureCard
                            icon={Shield}
                            title="Unmatched Safety"
                            desc="Every ride is tracked in real-time. Our SOS features and vetted drivers ensure your peace of mind."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Always On Time"
                            desc="Our predictive algorithms ensure that your ride arrives exactly when you need it. No delays."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={CreditCard}
                            title="Seamless Payments"
                            desc="Go cashless with our integrated wallet. Pay via UPI, Card, or Apple Pay securely in seconds."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Map}
                            title="Live Tracking"
                            desc="Share your ride details with loved ones. Watch your ride arrive in real-time on the map."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Smartphone}
                            title="Super App"
                            desc="Book rides, order food, and send packages—all from a single, beautifully designed application."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Star}
                            title="Premium Comfort"
                            desc="Choose from our fleet of top-rated vehicles. Clean, air-conditioned, and maintained for your comfort."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* App Download Section - WHITE BG */}
            <section className="py-24 bg-white relative overflow-hidden w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16 max-w-7xl mx-auto">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle size={14} /> Available on iOS & Android
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold leading-tight text-slate-900">
                            Get the App. <br />
                            <span className="text-purple-600">Ride Smarter.</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-md">
                            Unlock exclusive deals, track your rides in real-time, and experience the future of mobility at your fingertips.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:-translate-y-1">
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wide opacity-70">Download on the</div>
                                    <div className="text-xl font-bold font-heading leading-none">App Store</div>
                                </div>
                            </button>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:-translate-y-1">
                                <div className="text-left">
                                    <div className="text-[10px] uppercase tracking-wide opacity-70">Get it on</div>
                                    <div className="text-xl font-bold font-heading leading-none">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-indigo-50 blur-3xl rounded-full opacity-70 w-full h-full transform scale-90"></div>
                        {/* Abstract Phone Representation */}
                        <div className="relative w-[300px] h-[600px] bg-white border-[8px] border-slate-900 rounded-[48px] shadow-2xl overflow-hidden z-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
                            {/* Screen Content Mockup */}
                            <div className="relative z-10 p-6 space-y-4 pt-12">
                                <div className="h-20 w-full bg-purple-600 rounded-2xl shadow-lg flex flex-col justify-center px-6 text-white pb-2 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Map size={64} />
                                    </div>
                                    <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Current Location</div>
                                    <div className="font-bold text-xl truncate">Indiranagar, Blr</div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="h-16 w-full bg-purple-50 rounded-xl shadow-sm border border-purple-200 flex items-center p-3 gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-purple-600 shadow-sm">
                                            <Truck size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900 text-sm">Auto</div>
                                            <div className="text-[10px] text-slate-500 font-medium">2 mins away</div>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">₹85</div>
                                    </div>

                                    <div className="h-16 w-full bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-3 gap-3 opacity-60">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-400">
                                            <Car size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900 text-sm">Cab</div>
                                            <div className="text-[10px] text-slate-500 font-medium">4 mins away</div>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">₹140</div>
                                    </div>

                                    <div className="h-16 w-full bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-3 gap-3 opacity-60">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-400">
                                            <Star size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900 text-sm">Premium</div>
                                            <div className="text-[10px] text-slate-500 font-medium">6 mins away</div>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">₹190</div>
                                    </div>
                                </div>
                            </div>
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
