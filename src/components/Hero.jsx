import React from 'react';
import BookingWidget from './BookingWidget';
import { ShieldCheck, Zap } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center pt-20 pb-20 overflow-hidden bg-white">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/4"></div>

            <div className="w-full px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl mx-auto">

                {/* Text Content */}
                <div className="space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        The Future of Mobility is Here
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight text-slate-900">
                        Move with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Zero Gravity</span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                        Experience the smoothest ride of your life. From instant city hops to comfortable outstation journeys, we teleport you in style.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600 font-bold">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold leading-none text-slate-900">Safe & Secure</h4>
                                <span className="text-xs text-slate-500">Verified Drivers</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600 font-bold">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold leading-none text-slate-900">Lightning Fast</h4>
                                <span className="text-xs text-slate-500">Pickup in 3 mins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Widget / Right Side */}
                <div className="relative">
                    {/* Decorative Floaties */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-100 rounded-2xl rotate-12 opacity-60 float-anim"></div>
                    <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-50 rounded-full opacity-60 float-anim" style={{ animationDelay: '1s' }}></div>

                    <BookingWidget />
                </div>

            </div>
        </div>
    );
};

export default Hero;
