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
    <div className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">More Than Just Bookings</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Roamnexa is an entire ecosystem designed to make every aspect of your journey flawless, from pre-departure to post-trip memories.
          </p>
        </div>

        <div className="space-y-24">
          {categories.map((category, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/3">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">{category.title}</h3>
                <p className="text-slate-600 text-lg mb-8">{category.description}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors">
                  Explore {category.title} <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {category.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:bg-white hover-float cursor-pointer">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-slate-700">
                        <Icon size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
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
