import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Features from './components/Features';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden ${darkMode ? 'bg-[#0b1329] text-white' : 'bg-[#e5eef5] text-slate-800'}`}>
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-20">
        <BookingForm />
      </div>
      
      {/* Spacer for the overlapping search button */}
      <div className="h-12"></div>
      
      <Features />
      <Footer />
      <AIChatbot />

      {/* Floating Day/Night Mode Glassmorphic Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed right-6 bottom-28 z-[100] w-14 h-14 bg-white/20 dark:bg-black/35 border border-white/30 dark:border-white/10 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-xl group hover:shadow-blue-500/20 cursor-pointer"
        title="Toggle Theme"
      >
        {darkMode ? (
          <Sun size={24} className="text-yellow-400 animate-pulse group-hover:rotate-45 transition-transform duration-500" />
        ) : (
          <Moon size={24} className="text-indigo-600 animate-bounce-slow group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>
    </div>
  );
}

export default App;
