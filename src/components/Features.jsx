import React from 'react';
import { Shield, Map, Wallet, Ticket, HeartHandshake, Star, BookOpen, Crown } from 'lucide-react';

const Features = () => {
  const categories = [
    {
      title: "Smart Travel Tools",
      description: "Everything you need on the go, in one app.",
      items: [
        { icon: Shield, name: "Document Vault", desc: "Store passport, visa, tickets in one secure place" },
        { icon: Map, name: "Offline Maps", desc: "Download city maps for no-wifi navigation" },
        { icon: Wallet, name: "Multi-currency Wallet", desc: "Pay in local currency, track spend abroad" }
      ]
    },
    {
      title: "Lifestyle Add-ons",
      description: "Elevate your travel experience.",
      items: [
        { icon: Ticket, name: "Experiences", desc: "Book tours, food walks, adventure activities" },
        { icon: Shield, name: "Travel Insurance", desc: "On-the-spot coverage, claims via app" },
        { icon: Wallet, name: "SIM & eSIM", desc: "Buy international data plans pre-departure" }
      ]
    },
    {
      title: "Community & Social",
      description: "Connect with fellow travelers.",
      items: [
        { icon: HeartHandshake, name: "Travel Buddies", desc: "Match with solo travelers on same route" },
        { icon: Star, name: "Verified Reviews", desc: "Honest ratings from real Roamnexa travelers" },
        { icon: BookOpen, name: "Trip Journals", desc: "Auto-generate travel diaries from bookings" }
      ]
    },
    {
      title: "Loyalty & Monetization",
      description: "Earn as you explore.",
      items: [
        { icon: Crown, name: "Voygo Rewards", desc: "Earn points on bookings, redeem for travel" },
        { icon: Ticket, name: "Subscription Pass", desc: "Monthly pass for zero fees + priority AI" },
        { icon: Wallet, name: "B2B Portal", desc: "Corporate travel management for companies" }
      ]
    }
  ];

  return (
    <div id="features" className="py-24 bg-transparent relative overflow-hidden transition-all duration-500">
      {/* Decorative glass elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/5 rounded-full filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-400/5 rounded-full filter blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wide">More Than Just Bookings</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Roamnexa is an entire ecosystem designed to make every aspect of your journey flawless, from pre-departure to post-trip memories.
          </p>
        </div>

        <div className="space-y-24">
          {categories.map((category, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/3">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{category.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 font-medium">{category.description}</p>
                <button className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 flex items-center gap-2 transition-colors cursor-pointer group uppercase text-sm tracking-wider">
                  Explore {category.title} <span className="group-hover:translate-x-1.5 transition-transform" aria-hidden="true">&rarr;</span>
                </button>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {category.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white/40 dark:bg-slate-900/35 backdrop-blur-xl border border-white/50 dark:border-slate-800/80 rounded-[2rem] p-6 hover-float cursor-pointer hover:bg-white/60 dark:hover:bg-slate-900/50 shadow-sm transition-all duration-300">
                      <div className="w-12 h-12 bg-white/70 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-slate-700 dark:text-slate-200">
                        <Icon size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
