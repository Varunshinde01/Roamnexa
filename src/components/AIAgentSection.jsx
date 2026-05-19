import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, TrendingDown, MessageSquareText, Compass } from 'lucide-react';

const AIAgentSection = () => {
  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-4">
            <Sparkles size={18} />
            Powered by Roamnexa AI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Meet Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Smart Travel Agent</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Say goodbye to endless planning. Our AI agent creates personalized itineraries, predicts prices, and books everything through a simple chat interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Compass className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Itinerary Builder</h3>
            <p className="text-slate-600 mb-6">
              Get day-by-day plans tailored perfectly to your budget, interests, and travel style. Generates in seconds.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex gap-3 items-start">
                <Bot className="text-blue-500 mt-1" size={20} />
                <p className="text-sm text-slate-700 font-medium">"I've planned a 3-day adventure in Bali focused on surfing and local cuisine, just for you."</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquareText className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conversational Booking</h3>
            <p className="text-slate-600 mb-6">
              Book flights, hotels, and cabs by chatting naturally. No more filling out complex forms.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div>
                <p className="text-sm text-slate-700">"Book a window seat flight to Paris for next Friday under $500."</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingDown className="text-rose-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Price Predictor</h3>
            <p className="text-slate-600 mb-6">
              Our AI analyzes millions of data points to tell you exactly when to buy tickets for the best price.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Current Price</p>
                <p className="text-lg font-bold text-slate-900">$450</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-500 font-medium">Wait to buy</p>
                <p className="text-sm font-bold text-green-600">Expected: $380</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentSection;
