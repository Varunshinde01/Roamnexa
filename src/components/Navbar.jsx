import React, { useState } from 'react';
import { Menu, X, User, Briefcase, Percent, LogOut, BookOpen, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 bg-white/20 dark:bg-black/35 backdrop-blur-xl border border-white/30 dark:border-white/5 py-3 px-6 rounded-full shadow-xl transition-all duration-300">
        <div className="w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">R</div>
              <span className="text-xl font-black tracking-tight text-white">Roamnexa</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#offers" className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors">
                <Percent size={16} className="text-orange-400" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-orange-400 font-bold uppercase">Super Offers</span>
                  <span>Explore great deals</span>
                </div>
              </a>
              <div className="h-8 w-px bg-white/20" />
              <a href="#features" className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors">
                <Briefcase size={16} />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-white/60 font-bold uppercase">For Business</span>
                  <span>Corporate Travel</span>
                </div>
              </a>
              <div className="h-8 w-px bg-white/20" />

              {user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name?.split(' ')[0]}
                    <ChevronDown size={14} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <a href="#bookings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <BookOpen size={16} /> My Bookings
                      </a>
                      <button onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg hover-float-button cursor-pointer">
                  <User size={15} /> Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile burger */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#051423]/95 backdrop-blur-xl absolute top-full left-0 w-full border border-white/10 p-4 shadow-xl z-50 rounded-[2rem] mt-2">
            <div className="flex flex-col space-y-4">
              <a href="#offers" className="text-white font-medium flex items-center gap-2"><Percent size={16} className="text-orange-400" /> Offers</a>
              <a href="#features" className="text-white font-medium flex items-center gap-2"><Briefcase size={16} /> Corporate Travel</a>
              {user ? (
                <button onClick={logout} className="flex items-center gap-2 text-red-400 font-medium"><LogOut size={16} /> Logout ({user.name})</button>
              ) : (
                <button onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium w-full">
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
