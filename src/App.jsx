import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Features from './components/Features';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <div className="min-h-screen bg-[#e5eef5] overflow-x-hidden font-sans">
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
    </div>
  );
}

export default App;
