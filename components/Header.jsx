
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Home', path: '/', icon: 'fa-house' },
    { name: 'Arena', path: '/tournaments', icon: 'fa-trophy' },
    { name: 'Hall', path: '/leaderboard', icon: 'fa-crown' },
    { name: 'Live', path: '/streams', icon: 'fa-tv' },
  ];

  return (
    <>
      {/* Top Header - Fixed Top */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-bg-dark/95 border-b border-primary/20 py-2 shadow-2xl backdrop-blur-md' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative">
              <img src="https://res.cloudinary.com/dbjjzyrr3/image/upload/v1768567786/tiger-logo_jcf2zj.png" className="w-8 h-8 md:w-12 md:h-12 rounded group-hover:rotate-[360deg] transition-transform duration-700" alt="Logo" />
              <div className="absolute inset-0 bg-primary/20 animate-pulse blur-md -z-10"></div>
            </div>
            <div className="font-orbitron font-black leading-none text-glow">
              <div className="flex items-center gap-1">
                <span className="text-white text-xs md:text-xl block tracking-tighter">TAIGOUR'S</span>
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
              </div>
              <span className="text-primary text-[7px] md:text-sm tracking-[0.2em]">E-SPORTS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-rajdhani font-bold transition-all uppercase tracking-[0.15em] text-sm relative group ${isActive(link.path) ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            <Link 
              to="/admin" 
              className={`px-6 py-1.5 border-2 border-accent text-accent font-orbitron font-black text-xs hover:bg-accent hover:text-white transition-all skew-x-[-15deg] ${isAdmin ? 'bg-accent text-white shadow-[0_0_15px_rgba(255,0,128,0.3)]' : ''}`}
            >
              <span className="inline-block skew-x-[15deg] uppercase">Panel</span>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-bg-dark/90 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0.5rem)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative ${isActive(link.path) ? 'text-primary' : 'text-gray-500'}`}
            >
              {isActive(link.path) && (
                <span className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"></span>
              )}
              <i className={`fas ${link.icon} ${isActive(link.path) ? 'text-lg scale-110' : 'text-base opacity-60'}`}></i>
              <span className={`text-[9px] font-orbitron font-black uppercase tracking-wider ${isActive(link.path) ? 'opacity-100' : 'opacity-40'}`}>
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
