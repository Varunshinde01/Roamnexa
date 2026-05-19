import React, { useState } from 'react';
import { Menu, X, User, Briefcase, Percent, LogOut, BookOpen, ChevronDown, Heart, Shield } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/50 to-transparent py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* Logo - Styled exactly like make my trip logo! */}
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-2xl font-black tracking-tight text-white lowercase">roam</span>
              <span className="bg-[#e53935] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-[4px] shadow-sm ml-0.5 animate-pulse">nexa</span>
            </div>

            {/* Desktop Navbar Option Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              
              {/* List your property */}
              <a href="#list-property" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-yellow-400">
                  <Percent size={14} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] text-slate-300 font-extrabold uppercase">List Your Property</span>
                  <span className="text-[9px] text-white/70 font-semibold">Grow your business!</span>
                </div>
              </a>

              {/* Introducing MyBiz */}
              <a href="#mybiz" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-orange-400">
                  <Briefcase size={14} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] text-slate-300 font-extrabold uppercase">Introducing MyBiz</span>
                  <span className="text-[9px] text-white/70 font-semibold">Business Travel Solution</span>
                </div>
              </a>

              <div className="h-6 w-px bg-white/20" />

              {/* My Trips */}
              <a href="#bookings" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-xs font-black uppercase tracking-wider">
                <BookOpen size={15} className="text-blue-300" />
                <span>My Trips</span>
              </a>

              {/* Wishlist */}
              <a href="#wishlist" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-xs font-black uppercase tracking-wider">
                <Heart size={15} className="text-red-400 fill-red-400" />
                <span>Wishlist</span>
              </a>

              <div className="h-6 w-px bg-white/20" />

              {/* User Login Section - Styled exactly like MMT login button */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg shadow-blue-500/10 cursor-pointer border border-white/15"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center font-bold text-[10px]">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name?.split(' ')[0]}
                    <ChevronDown size={12} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="font-extrabold text-slate-800 text-xs">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{user.email}</p>
                      </div>
                      <a href="#bookings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <BookOpen size={15} /> My Bookings
                      </a>
                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg border border-white/20 cursor-pointer hover:scale-103"
                >
                  <User size={14} />
                  <span>Login or Create Account</span>
                </button>
              )}

              {/* Currency Selector */}
              <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-white cursor-pointer hover:bg-white/15">
                <span>🇮🇳 INR</span>
                <ChevronDown size={12} />
              </div>

            </div>

            {/* Mobile burger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl absolute top-full left-0 w-full border-b border-white/10 p-5 shadow-2xl z-50">
            <div className="flex flex-col space-y-4">
              <a href="#offers" className="text-white font-medium flex items-center gap-2"><Percent size={16} className="text-orange-400" /> Offers</a>
              <a href="#features" className="text-white font-medium flex items-center gap-2"><Briefcase size={16} /> Corporate Travel</a>
              {user ? (
                <button onClick={logout} className="flex items-center gap-2 text-red-400 font-medium"><LogOut size={16} /> Logout ({user.name})</button>
              ) : (
                <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium w-full">
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
