import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Roamnexa</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Your AI-powered travel companion. Plan, book, and experience the world effortlessly.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Book</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Flights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trains</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cabs & Rentals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hotels & Stays</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">AI Itinerary Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Experiences & Tours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Travel Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Voygo Rewards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Travel Insurance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">B2B Partner Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Roamnexa Travel Technologies. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
