import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Shield, Smartphone, Map, CreditCard, Star, Clock, CheckCircle, Car, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import autoImg from '../assets/auto1.jpg';
import carImg from '../assets/car1.jpg';
import truckImg from '../assets/truck2.png';
import customerAppImg from '../assets/playstorecustomer.png';
import driverAppImg from '../assets/playstoredriver.png';
import noSurgeImg from '../assets/No Surge Pricing, Ever.png';
import superAppImg from '../assets/superapp.png';
import paymentImg from '../assets/payment .png';
import liveTrackingImg from '../assets/livetracking.png';

const FeatureCard = ({ image, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden h-full flex flex-col"
    >
        <div className="h-48 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
        </div>
        <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors">{title}</h3>
            <p className="text-slate-500 text-base leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-white">
            <Navbar />
            <Hero />

            {/* Our Services Section */}
            <section className="py-24 w-full bg-white">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                            One App. <span className="text-purple-600">Every Way to Move.</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            Choose the perfect ride for your journey. Safe, reliable, and affordable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Auto */}
                        <div className="bg-slate-50 rounded-[32px] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group text-center border border-slate-100 overflow-hidden relative flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="h-48 w-full flex items-center justify-center mb-6 relative shrink-0">
                                <div className="absolute inset-0 bg-purple-100/50 rounded-full scale-75 group-hover:scale-100 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                <img src={autoImg} alt="Auto" className="w-48 object-contain relative z-10 drop-shadow-xl group-hover:scale-110 group-hover:rotate-1 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1">Auto</h3>
                            <p className="text-purple-600 font-medium text-sm mb-3">Quick and affordable rides to your doorstep.</p>
                            <p className="text-slate-500 mb-6 flex-grow">Quick, metered-style flat rates for everyday errands. No haggling.</p>
                            <button
                                onClick={() => navigate('/ride', { state: { serviceType: 'auto' } })}
                                className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors"
                            >
                                Book Now
                            </button>
                        </div>

                        {/* Cab */}
                        <div className="bg-slate-50 rounded-[32px] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group text-center border border-slate-100 overflow-hidden relative flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="h-48 w-full flex items-center justify-center mb-6 relative shrink-0">
                                <div className="absolute inset-0 bg-purple-100/50 rounded-full scale-75 group-hover:scale-100 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                <img src={carImg} alt="Cab" className="w-64 object-contain relative z-10 drop-shadow-xl group-hover:scale-110 group-hover:-rotate-1 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1">Cab (Mini / Sedan / SUV)</h3>
                            <p className="text-purple-600 font-medium text-sm mb-3">Comfortable AC rides for city travel.</p>
                            <p className="text-slate-500 mb-6 flex-grow">Top-rated AC minis, sedans, and SUVs for your comfort without unexpected price spikes.</p>
                            <button
                                onClick={() => navigate('/ride', { state: { serviceType: 'car' } })}
                                className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors"
                            >
                                Book Now
                            </button>
                        </div>

                        {/* Truck */}
                        <div className="bg-slate-50 rounded-[32px] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group text-center border border-slate-100 overflow-hidden relative flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                            <div className="h-48 w-full flex items-center justify-center mb-6 relative shrink-0">
                                <div className="absolute inset-0 bg-blue-100/50 rounded-full scale-75 group-hover:scale-100 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                <img src={truckImg} alt="Truck" className="w-56 object-contain relative z-10 drop-shadow-xl group-hover:scale-110 group-hover:rotate-1 transition-all duration-500" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1">Goods & Logistics (Trucks)</h3>
                            <p className="text-purple-600 font-medium text-sm mb-3">Reliable goods transport & logistics.</p>
                            <p className="text-slate-500 mb-6 flex-grow">Need to move house or send a business delivery? We have 3-Wheeler Tempos for boxes and Tata Ace trucks for furniture.</p>
                            <button
                                onClick={() => navigate('/ride', { state: { serviceType: 'truck' } })}
                                className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

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

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto justify-items-center">
                        <FeatureCard
                            image={noSurgeImg}
                            title="No Surge Pricing, Ever"
                            desc="Raining? Heavy traffic? Peak hours? Our rates stay the same. Stop guessing the price and start saving money."
                            delay={0.1}
                        />
                        <FeatureCard
                            image={superAppImg}
                            title="Super App Experience"
                            desc="Book rides, move furniture, and send items - all from a single, dynamically designed application."
                            delay={0.2}
                        />
                        <FeatureCard
                            image={paymentImg}
                            title="Seamless Payments"
                            desc="Go cashless with our integrated wallet. Pay via UPI, Card, or Cash securely in seconds."
                            delay={0.3}
                        />
                        <FeatureCard
                            image={liveTrackingImg}
                            title="Live Tracking"
                            desc="Share your ride details with loved ones. Watch your ride arrive in real-time on the map."
                            delay={0.4}
                        />
                        <FeatureCard
                            image="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80"
                            title="Unmatched Safety"
                            desc="Every ride is tracked in real-time. Our SOS features and vetted drivers ensure your peace of mind."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* App Download Section - WHITE BG */}
            <section className="py-24 bg-white relative overflow-hidden w-full">
                <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                            Ready to get to your destination at the best price?
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Join thousands of Indians choosing fair prices and reliable rides. Download Transporter Today.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Customer App */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
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
                                    className="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors text-center"
                                >
                                    App Store
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.transporter.customer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors text-center"
                                >
                                    Google Play
                                </a>
                            </div>
                        </div>

                        {/* Driver App */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
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
        </div>
    );
};

export default Home;
