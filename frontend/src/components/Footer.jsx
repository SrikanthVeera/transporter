import React from 'react';
import { Rocket, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        if (path === '#') return; // Don't navigate for placeholder links
        navigate(path);
    };

    return (
        <footer className="bg-[#05030a] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

            <div className="container relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-purple-600">
                                <Rocket size={18} fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold font-heading text-white">Transporter</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Redefining urban mobility with style, safety, and speed. Join the revolution today.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6 text-white">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <button 
                                    onClick={() => handleNavigation('/')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleNavigation('/about')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleNavigation('#')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Contact
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6 text-white">Products</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <button 
                                    onClick={() => handleNavigation('/rides')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Rider
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleNavigation('/drive')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Driver
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6 text-white">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <button 
                                    onClick={() => handleNavigation('#')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Help Center
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleNavigation('#')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Terms
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleNavigation('#')} 
                                    className="hover:text-purple-300 transition-colors text-left"
                                >
                                    Policy
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2024 Transporter Technologies Inc.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <button onClick={() => handleNavigation('#')} className="hover:text-white transition-colors">Privacy</button>
                        <button onClick={() => handleNavigation('#')} className="hover:text-white transition-colors">Terms</button>
                        <button onClick={() => handleNavigation('#')} className="hover:text-white transition-colors">Security</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
