import React, { useState, useEffect } from 'react';

const stats = [
  { label: 'Happy Travelers', value: '10M+' },
  { label: 'Destinations', value: '500+' },
  { label: 'Daily Bookings', value: '50K+' },
  { label: 'App Rating', value: '4.8⭐' },
];

const words = ['Discover', 'Explore', 'Experience', 'Adventure'];

const Hero = () => {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative pt-24 pb-56 md:pb-64 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020c1b 0%, #051e40 50%, #0a3270 100%)' }}>
      {/* Animated blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
          AI-Powered Travel Platform — Plan smarter, travel better
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
          <span className="block" style={{
            background: 'linear-gradient(90deg, #93c5fd, #c4b5fd, #f9a8d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            transition: 'all 0.5s'
          }}>
            {words[wordIdx]}
          </span>
          <span className="block text-white">the World with</span>
          <span className="block" style={{
            background: 'linear-gradient(90deg, #60a5fa, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Roamnexa
          </span>
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(191, 219, 254, 0.8)' }}>
          Book flights, hotels, trains &amp; cabs. Let our AI plan your perfect itinerary in seconds.
          One platform. Infinite adventures.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl px-4 py-4 border"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-2xl md:text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs font-medium mt-1" style={{ color: '#93c5fd' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
