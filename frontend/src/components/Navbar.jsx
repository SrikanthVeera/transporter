import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from "../assets/customer's logo.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm' : 'bg-white py-6 shadow-sm'}`}>
            <div className="container flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={logoImg} alt="Transporter" className="h-12 md:h-20 w-auto object-contain" />
                    <span className="text-lg md:text-2xl font-bold font-heading tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">Transporter</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Ride', path: '/ride' },
                        { name: 'Drive', path: '/drive' },
                        { name: 'About', path: '/about' }
                    ].map((item) => (
                        <Link key={item.name} to={item.path} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl">
                    <Link to="/" className="p-3 hover:bg-purple-50 rounded-lg text-gray-800 font-medium">Home</Link>
                    <Link to="/ride" className="p-3 hover:bg-purple-50 rounded-lg text-gray-800 font-medium">Ride</Link>
                    <Link to="/drive" className="p-3 hover:bg-purple-50 rounded-lg text-gray-800 font-medium">Drive</Link>
                    <Link to="/about" className="p-3 hover:bg-purple-50 rounded-lg text-gray-800 font-medium">About</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
