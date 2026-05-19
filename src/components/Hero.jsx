import React from 'react';

const Hero = () => {
  return (
    <div 
      className="relative pt-28 pb-56 md:pb-80 flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat min-h-[50vh] md:min-h-[58vh]"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 60%, rgba(229,238,245,1) 100%), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=85')`
      }}
    >
      {/* Decorative floating clouds/mist overlay */}
      <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-6">
        {/* Subtle, beautiful floating tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 text-white text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md shadow-md animate-bounce-slow">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Welcome to Roamnexa Premium
        </div>
      </div>
    </div>
  );
};

export default Hero;
