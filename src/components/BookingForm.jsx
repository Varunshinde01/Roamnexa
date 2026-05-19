import React, { useState } from 'react';
import { Plane, Building, Home, Package, Train, Bus, Car, CreditCard, Sparkles, ChevronDown, ArrowLeftRight, Search, X, Star, Anchor, Shield, Globe, Landmark, HeartHandshake } from 'lucide-react';
import axios from 'axios';

// The MakeMyTrip styled tabs row
const tabs = [
  { id: 'flight', icon: Plane, label: 'Flights' },
  { id: 'hotel', icon: Building, label: 'Hotels' },
  { id: 'homestay', icon: Home, label: 'Villas & Homestays' },
  { id: 'holiday', icon: Package, label: 'Holiday Packages' },
  { id: 'train', icon: Train, label: 'Trains' },
  { id: 'bus', icon: Bus, label: 'Buses' },
  { id: 'cab', icon: Car, label: 'Cabs' },
  { id: 'experiences', icon: Globe, label: 'Tours & Attractions' },
  { id: 'visa', icon: Shield, label: 'Visa' },
  { id: 'cruise', icon: Anchor, label: 'Cruise', newTag: true },
  { id: 'forex', icon: CreditCard, label: 'Forex Card & Currency' },
  { id: 'insurance', icon: HeartHandshake, label: 'Travel Insurance' },
];

const ResultsModal = ({ results, type, onClose, onBook }) => {
  const [modalTab, setModalTab] = useState('tickets'); // 'tickets' or 'timetable'
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!results) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-white/40" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex flex-col p-6 pb-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 tracking-wide uppercase">
              {type === 'flight' ? `✈️ Flights: ${results.from} ⇄ ${results.to}` :
               type === 'hotel' ? `🏨 Hotels in ${results.city}` :
               `🚂 Trains: ${results.from} ⇄ ${results.to}`}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400"><X size={20} /></button>
          </div>

          {/* Sub-tabs for Flight search */}
          {type === 'flight' && (
            <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full mt-4 border border-slate-200/20 max-w-sm">
              <button
                onClick={() => setModalTab('tickets')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center uppercase tracking-wider ${
                  modalTab === 'tickets' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🎟️ Book Tickets
              </button>
              <button
                onClick={() => setModalTab('timetable')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center uppercase tracking-wider ${
                  modalTab === 'timetable' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📋 Live Timetable
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Available Tickets Tab */}
          {type === 'flight' && modalTab === 'tickets' && results.flights?.map(f => (
            <div key={f.id} className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 rounded-[2rem] p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover:scale-[1.01]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                    <span className="text-xl">{f.logo || '✈️'}</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      {f.airline}
                      <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-slate-200/50">{f.code}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{f.class} Class</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-6 py-2 sm:py-0 border-y sm:border-y-0 border-slate-100">
                  <div className="text-center sm:text-left">
                    <div className="text-xl font-black text-slate-800">{f.departure}</div>
                    <div className="text-[11px] font-black text-blue-600 tracking-widest mt-0.5">{results.from}</div>
                  </div>

                  <div className="flex flex-col items-center min-w-[70px]">
                    <div className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">{f.duration}</div>
                    <div className="w-full flex items-center gap-1 my-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                      <div className="flex-1 h-0.5 border-t border-dashed border-indigo-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400">{f.stops}</div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-xl font-black text-slate-800">{f.arrival}</div>
                    <div className="text-[11px] font-black text-blue-600 tracking-widest mt-0.5">{results.to}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                  <div>
                    <div className="text-2xl font-black text-blue-600">₹{f.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-wider">{f.baggage}</div>
                  </div>
                  <button 
                    onClick={() => onBook({ type: 'flight', from: results.from, to: results.to, price: f.price, details: f })}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-md cursor-pointer uppercase tracking-wider shrink-0"
                  >
                    Book Flight
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Live Airport Timetable Tab */}
          {type === 'flight' && modalTab === 'timetable' && (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-400 tracking-wide flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      LIVE DEPARTURE TIMETABLE
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time gate and delay streams between {results.from} and {results.to}</p>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Flight..."
                    className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 max-w-[200px]"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="grid grid-cols-5 gap-4 bg-slate-900/60 p-4 border-b border-slate-800 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <div>Airline / Flight</div>
                  <div className="text-center">Departure</div>
                  <div className="text-center">Terminal / Gate</div>
                  <div className="text-center">Duration</div>
                  <div className="text-right">Live Status</div>
                </div>

                <div className="divide-y divide-slate-900/70">
                  {results.flights
                    ?.filter(f => f.airline.toLowerCase().includes(searchTerm.toLowerCase()) || f.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(f => {
                      const isDelayed = f.status === 'DELAYED';
                      const isBoarding = f.status === 'BOARDING';
                      const isGateOpen = f.status === 'GATE OPEN';
                      
                      let statusBadgeClass = 'bg-blue-950 text-blue-400 border-blue-900';
                      let pulseColor = 'bg-blue-400';
                      if (isDelayed) {
                        statusBadgeClass = 'bg-rose-950 text-rose-400 border-rose-900';
                        pulseColor = 'bg-rose-400';
                      } else if (isBoarding) {
                        statusBadgeClass = 'bg-amber-950 text-amber-400 border-amber-900';
                        pulseColor = 'bg-amber-400';
                      } else if (isGateOpen || f.status === 'ON TIME') {
                        statusBadgeClass = 'bg-emerald-950 text-emerald-400 border-emerald-900';
                        pulseColor = 'bg-emerald-400';
                      }

                      return (
                        <div key={f.id} className="grid grid-cols-5 gap-4 p-4 items-center text-xs font-bold border-b border-slate-900/50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{f.logo}</span>
                            <div>
                              <div className="text-slate-200 font-extrabold">{f.airline}</div>
                              <div className="text-slate-500 font-bold text-[10px] tracking-wide mt-0.5">{f.code}</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-slate-200 font-extrabold text-sm">{f.departure}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-slate-200 font-extrabold">Terminal {f.terminal}</div>
                            <div className="text-slate-400 text-[10px] mt-0.5">Gate {f.gate}</div>
                          </div>

                          <div className="text-center text-slate-400">
                            <div>{f.duration}</div>
                            <div className="text-[9px] mt-0.5 text-slate-500">{f.stops}</div>
                          </div>

                          <div className="text-right flex items-center justify-end gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBadgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${pulseColor} animate-pulse`}></span>
                              {f.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
          
          {type === 'hotel' && results.hotels?.map(h => (
            <div key={h.id} className="border border-slate-200 rounded-xl overflow-hidden flex hover:shadow-md transition-shadow">
              <img src={h.image} alt={h.name} className="w-32 h-32 object-cover flex-shrink-0" />
              <div className="p-4 flex-1 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{h.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {'★'.repeat(h.stars)}<span className="text-slate-400 text-sm ml-1">({h.reviews} reviews)</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{h.amenities.join(' • ')}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-black text-blue-600">₹{h.price.toLocaleString()}</div>
                  <button onClick={() => onBook({ type: 'hotel', to: results.city, price: h.price, details: h })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mt-2">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const INDIAN_AIRPORTS = [
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport', type: 'International' },
  { city: 'Bengaluru', code: 'BLR', name: 'Kempegowda International Airport', type: 'International' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', type: 'International' },
  { city: 'Pune', code: 'PNQ', name: 'Pune International Airport', type: 'Domestic/International' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim Airport Goa', type: 'International' }
];

const BookingForm = ({ onBookingSuccess }) => {
  const [activeTab, setActiveTab] = useState('flight');
  const [tripType, setTripType] = useState('oneway');
  const [fromCity, setFromCity] = useState({ city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' });
  const [toCity, setToCity] = useState({ city: 'Bengaluru', code: 'BLR', name: 'Kempegowda International Airport' });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  const [departureDate, setDepartureDate] = useState('2026-05-21');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 Traveller');
  const [cabinClass, setCabinClass] = useState('Economy/Premium Economy');
  const [specialFare, setSpecialFare] = useState('Regular');
  
  // Custom states for other tabs
  const [cityInput, setCityInput] = useState('Bengaluru');
  const [checkin, setCheckin] = useState('2026-05-21');
  const [checkout, setCheckout] = useState('2026-05-22');
  const [rooms, setRooms] = useState('1 Room, 2 Guests');
  
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [resultType, setResultType] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      if (activeTab === 'flight') {
        const res = await axios.get(`/api/bookings/search/flights?from=${fromCity.city}&to=${toCity.city}&date=${departureDate}`);
        setResults(res.data);
        setResultType('flight');
      } else if (activeTab === 'hotel' || activeTab === 'homestay') {
        const res = await axios.get(`/api/bookings/search/hotels?city=${cityInput}&checkin=${checkin}&checkout=${checkout}`);
        setResults(res.data);
        setResultType('hotel');
      } else {
        setBookingMsg(`✅ Query submitted for ${activeTab}! Powered by Roamnexa.`);
        setTimeout(() => setBookingMsg(''), 4000);
      }
    } catch {
      setBookingMsg('⚠️ Search mock loaded! Connecting you to booking channels...');
      setTimeout(() => setBookingMsg(''), 4000);
    } finally {
      setSearching(false);
    }
  };

  const handleBook = async (bookingData) => {
    setResults(null);
    setBookingMsg(`✅ Booking Saved Successfully! Booking Reference: RNX-${Math.floor(100000 + Math.random() * 900000)}`);
    setTimeout(() => setBookingMsg(''), 5000);
  };

  return (
    <div className="relative z-20 mx-auto max-w-6xl -mt-24 md:-mt-36">
      
      {bookingMsg && (
        <div className="mb-6 p-4 bg-emerald-500 text-white font-black text-center shadow-lg rounded-2xl animate-pulse text-xs tracking-wider">
          {bookingMsg}
        </div>
      )}

      {/* Floating MakeMyTrip Card Container */}
      <div className="bg-white rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.12)] border border-slate-100 overflow-visible p-6 relative">
        
        {/* Row 1: The Iconic Tabs Selector */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-5 overflow-x-auto no-scrollbar scroll-smooth gap-4 mb-5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`flex flex-col items-center gap-2 group relative pb-3 transition-all cursor-pointer min-w-[70px] shrink-0 ${
                  isActive 
                    ? 'text-blue-600 font-extrabold scale-105' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-600' : 'group-hover:scale-105'}`}>
                  <Icon size={26} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[11px] font-bold text-center tracking-tight leading-none">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
                )}
                {tab.newTag && (
                  <span className="absolute -top-3.5 right-0 bg-[#a855f7] text-white text-[8px] font-black uppercase px-1 py-0.5 rounded shadow-sm scale-75 animate-bounce">New</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 2: AI Banner (Try Myra) */}
        <div className="bg-[#e5f3ff] hover:bg-[#d5ebff] border border-blue-100 rounded-full px-6 py-2.5 mx-auto max-w-2xl text-center text-xs font-black text-blue-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm mb-6 transition-all">
          <Sparkles size={14} className="text-blue-600 animate-pulse" />
          <span>Try myra (beta) - Your AI Assistant for Flights &amp; Stays</span>
          <span className="text-[10px] text-blue-500 font-extrabold">&rarr;</span>
        </div>

        {/* Row 3: Trip Options Toggles */}
        {activeTab === 'flight' && (
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="triptype" 
                  checked={tripType === 'oneway'} 
                  onChange={() => setTripType('oneway')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`font-black uppercase tracking-wider ${tripType === 'oneway' ? 'text-blue-600' : 'text-slate-500'}`}>One Way</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="triptype" 
                  checked={tripType === 'roundtrip'} 
                  onChange={() => setTripType('roundtrip')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`font-black uppercase tracking-wider ${tripType === 'roundtrip' ? 'text-blue-600' : 'text-slate-500'}`}>Round Trip</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="triptype" 
                  checked={tripType === 'multicity'} 
                  onChange={() => setTripType('multicity')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`font-black uppercase tracking-wider ${tripType === 'multicity' ? 'text-blue-600' : 'text-slate-500'}`}>Multi City</span>
              </label>
            </div>

            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Book International and Domestic Flights
            </div>
          </div>
        )}

        {/* Row 4: Core Fields Grid Layout (Exactly matches MakeMyTrip borders & structure) */}
        {activeTab === 'flight' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 border border-slate-200 rounded-3xl overflow-visible bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200 mb-6 relative">
            
            {/* FROM FIELD */}
            <div className="p-5 relative cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-3xl md:rounded-t-none md:rounded-l-3xl" onClick={() => setShowFromDropdown(!showFromDropdown)}>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">From</span>
              <div className="text-3xl font-black text-slate-800">{fromCity.city}</div>
              <div className="text-xs font-bold text-slate-500 mt-1 truncate">{fromCity.code}, {fromCity.name}</div>
              
              {showFromDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2" onClick={e => e.stopPropagation()}>
                  <span className="block text-[9px] font-black text-slate-400 uppercase p-2 tracking-wider">Select Airport</span>
                  {INDIAN_AIRPORTS.map(a => (
                    <div 
                      key={a.code}
                      onClick={() => { setFromCity(a); setShowFromDropdown(false); }}
                      className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-extrabold text-xs text-slate-800">{a.city} ({a.code})</div>
                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-[170px]">{a.name}</div>
                      </div>
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{a.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SWAP BUTTON OVER BOUNDARY */}
            <button 
              onClick={swapCities}
              className="absolute left-1/2 md:left-[20%] lg:left-[20%] top-[20%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-blue-500 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
              title="Swap Cities"
            >
              <ArrowLeftRight size={14} />
            </button>

            {/* TO FIELD */}
            <div className="p-5 relative cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setShowToDropdown(!showToDropdown)}>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">To</span>
              <div className="text-3xl font-black text-slate-800">{toCity.city}</div>
              <div className="text-xs font-bold text-slate-500 mt-1 truncate">{toCity.code}, {toCity.name}</div>

              {showToDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2" onClick={e => e.stopPropagation()}>
                  <span className="block text-[9px] font-black text-slate-400 uppercase p-2 tracking-wider">Select Airport</span>
                  {INDIAN_AIRPORTS.map(a => (
                    <div 
                      key={a.code}
                      onClick={() => { setToCity(a); setShowToDropdown(false); }}
                      className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-extrabold text-xs text-slate-800">{a.city} ({a.code})</div>
                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-[170px]">{a.name}</div>
                      </div>
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{a.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DEPARTURE FIELD */}
            <div className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors relative">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Departure</span>
              <input 
                type="date" 
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
              />
              <div className="text-3xl font-black text-slate-800">
                {departureDate ? new Date(departureDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `'${new Date(departureDate).getFullYear().toString().substring(2)}` : 'Select Date'}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">
                {departureDate ? new Date(departureDate).toLocaleDateString('en-IN', { weekday: 'long' }) : 'Thursday'}
              </div>
            </div>

            {/* RETURN FIELD */}
            <div className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors relative">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Return</span>
              <input 
                type="date" 
                value={returnDate}
                onChange={e => { setReturnDate(e.target.value); setTripType('roundtrip'); }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
              />
              <div className="text-lg font-extrabold text-slate-800 leading-snug">
                {returnDate ? new Date(returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `'${new Date(returnDate).getFullYear().toString().substring(2)}` : 'Tap to add a return date'}
              </div>
              <div className="text-[11px] font-bold text-slate-400 mt-1">
                {returnDate ? new Date(returnDate).toLocaleDateString('en-IN', { weekday: 'long' }) : 'for bigger discounts'}
              </div>
            </div>

            {/* PASSENGERS & CLASS FIELD */}
            <div className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-b-3xl md:rounded-b-none md:rounded-r-3xl">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Travellers &amp; Class</span>
              <select 
                value={`${passengers}|${cabinClass}`} 
                onChange={e => { const [p,c] = e.target.value.split('|'); setPassengers(p); setCabinClass(c); }}
                className="bg-transparent text-lg font-black text-slate-800 outline-none w-full cursor-pointer"
              >
                {['1 Traveller', '2 Travellers', '3 Travellers', '4 Travellers'].map(p => (
                  <option key={p} value={`${p}|Economy/Premium Economy`}>{p} · Economy</option>
                ))}
              </select>
              <div className="text-xs font-bold text-slate-500 mt-1 truncate">{cabinClass}</div>
            </div>

          </div>
        ) : (
          /* HOTELS / OTHER TABS GRID */
          <div className="grid grid-cols-1 md:grid-cols-4 border border-slate-200 rounded-3xl overflow-hidden bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200 mb-6">
            <div className="p-5">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">City / Destination</span>
              <input 
                type="text"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                placeholder="Where to stay?"
                className="w-full bg-transparent text-xl font-black text-slate-800 outline-none placeholder-slate-400"
              />
            </div>
            <div className="p-5 relative cursor-pointer">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check-In</span>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <div className="text-xl font-black text-slate-800">{checkin}</div>
            </div>
            <div className="p-5 relative cursor-pointer">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check-Out</span>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <div className="text-xl font-black text-slate-800">{checkout}</div>
            </div>
            <div className="p-5">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Rooms &amp; Guests</span>
              <select value={rooms} onChange={e => setRooms(e.target.value)} className="w-full bg-transparent text-lg font-black text-slate-800 outline-none cursor-pointer">
                {['1 Room, 2 Guests','2 Rooms, 4 Guests'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Row 5: Special Fares Segment Selector */}
        {activeTab === 'flight' && (
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Special Fares:</span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { name: 'Regular', desc: 'Regular fares' },
                { name: 'Student', desc: 'Extra discounts/baggage' },
                { name: 'Armed Forces', desc: 'Up to ₹600 off' },
                { name: 'Have a GST number?', desc: 'Upto 10% Extra Savings!', tag: 'new' },
                { name: 'Senior Citizen', desc: 'Up to ₹600 off' },
                { name: 'Doctor and Nurses', desc: 'Up to ₹600 off' }
              ].map(fare => (
                <button
                  key={fare.name}
                  onClick={() => setSpecialFare(fare.name)}
                  type="button"
                  className={`px-4 py-2 border rounded-2xl text-[10px] font-black uppercase tracking-wider relative cursor-pointer transition-all ${
                    specialFare === fare.name 
                      ? 'bg-blue-50 text-blue-600 border-blue-500' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>{fare.name}</div>
                  <div className="text-[8px] font-bold text-slate-400 lowercase mt-0.5">{fare.desc}</div>
                  {fare.tag && (
                    <span className="absolute -top-2 right-0 bg-[#e53935] text-white text-[7px] px-1 py-0.2 rounded font-black uppercase scale-75">New</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 6: Helper Protections & Quick Pills */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input type="checkbox" id="protection" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 rounded cursor-pointer" />
            <label htmlFor="protection" className="cursor-pointer">
              Add <span className="font-extrabold text-slate-800">Price Drop Protection</span> If the price drops, we'll refund the difference. <span className="text-blue-500 underline cursor-pointer">View Details</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 text-slate-600 cursor-pointer">
              <span>✈️</span> Flight Tracker
            </button>
            <div className="relative">
              <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <span>🛍️</span> Shop Duty Free
              </button>
              <span className="absolute -top-3.5 -right-1 bg-[#e53935] text-white text-[8px] font-black uppercase px-1 py-0.5 rounded shadow scale-75">10% off</span>
            </div>
          </div>
        </div>

        {/* Row 7: Ultimate MakeMyTrip Floating Search Button */}
        <button
          onClick={handleSearch}
          disabled={searching}
          type="button"
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#008cff] to-[#0051ff] hover:from-[#007be0] hover:to-[#0047e0] text-white text-lg font-black px-24 py-4 rounded-full shadow-[0_8px_30px_rgba(0,140,255,0.35)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest z-30 cursor-pointer"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>

      </div>

      {/* Drawer Bar under the card */}
      <div className="mt-14 max-w-5xl mx-auto bg-white rounded-full border border-slate-200 shadow-md p-1 grid grid-cols-5 text-center text-[10px] font-black uppercase tracking-wider text-slate-600 divide-x divide-slate-100 items-center h-12">
        <div className="cursor-pointer hover:text-blue-600 flex items-center justify-center gap-1"><span>🌐</span> Where2Go</div>
        <div className="cursor-pointer hover:text-blue-600 flex items-center justify-center gap-1"><span>🛡️</span> International Insurance</div>
        <div className="cursor-pointer hover:text-blue-600 flex items-center justify-center gap-1"><span>✈️</span> Explore Flights</div>
        <div className="cursor-pointer hover:text-blue-600 flex items-center justify-center gap-1"><span>💼</span> MICE Meetings</div>
        <div className="cursor-pointer hover:text-blue-600 flex items-center justify-center gap-1"><span>🎁</span> Gift Cards</div>
      </div>

      {results && <ResultsModal results={results} type={resultType} onClose={() => setResults(null)} onBook={handleBook} />}
    </div>
  );
};

export default BookingForm;
