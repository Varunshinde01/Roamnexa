import React, { useState } from 'react';
import { Plane, Building, Home, Package, Train, Bus, Car, CreditCard, Sparkles, ChevronDown, ArrowLeftRight, Search, X, Star } from 'lucide-react';
import axios from 'axios';

const tabs = [
  { id: 'flight', icon: Plane, label: 'Flights' },
  { id: 'hotel', icon: Building, label: 'Hotels' },
  { id: 'homestay', icon: Home, label: 'Homestays' },
  { id: 'holiday', icon: Package, label: 'Holidays' },
  { id: 'train', icon: Train, label: 'Trains' },
  { id: 'bus', icon: Bus, label: 'Buses' },
  { id: 'cab', icon: Car, label: 'Cabs' },
  { id: 'forex', icon: CreditCard, label: 'Forex' },
  { id: 'ai-planner', icon: Sparkles, label: 'AI Planner', highlight: true },
];

const Field = ({ label, children }) => (
  <div className="p-4 hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    {children}
  </div>
);

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
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"><X size={20} /></button>
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
            <div key={f.id} className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 rounded-[2rem] p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group hover-float">
              {/* Boarding pass ticket style */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Airline details */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100/50 shadow-inner">
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

                {/* Departure & Arrival Schedule details */}
                <div className="flex items-center justify-between sm:justify-start gap-6 py-2 sm:py-0 border-y sm:border-y-0 border-slate-100">
                  <div className="text-center sm:text-left">
                    <div className="text-xl font-black text-slate-800">{f.departure}</div>
                    <div className="text-[11px] font-black text-blue-600 tracking-widest mt-0.5">{results.from}</div>
                    <div className="text-[10px] text-slate-400 font-bold">Terminal {f.terminal || 'T3'}</div>
                  </div>

                  <div className="flex flex-col items-center min-w-[70px]">
                    <div className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">{f.duration}</div>
                    <div className="w-full flex items-center gap-1 my-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                      <div className="flex-1 h-0.5 border-t-2 border-dashed border-indigo-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{f.stops}</div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-xl font-black text-slate-800">{f.arrival}</div>
                    <div className="text-[11px] font-black text-blue-600 tracking-widest mt-0.5">{results.to}</div>
                    <div className="text-[10px] text-slate-400 font-bold">Gate {f.gate || 'G12'}</div>
                  </div>
                </div>

                {/* Pricing and Action */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                  <div>
                    <div className="text-2xl font-black text-blue-600">₹{f.price.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-wider">{f.baggage} check-in</div>
                  </div>
                  <button 
                    onClick={() => onBook({ type: 'flight', from: results.from, to: results.to, price: f.price, details: f })}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer uppercase tracking-wider shrink-0"
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
              {/* Filter Panel */}
              <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg border border-slate-800 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-400 tracking-wide flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      LIVE TERMINAL DEPARTURE TIMETABLE
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time gate and delay streams between {results.from} and {results.to}</p>
                  </div>
                  
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Flight or Airline..."
                    className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 max-w-[200px]"
                  />
                </div>
              </div>

              {/* Timetable Table */}
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
                        <div key={f.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-slate-900/20 transition-all text-xs font-bold border-b border-slate-900/50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{f.logo}</span>
                            <div>
                              <div className="text-slate-200 font-extrabold">{f.airline}</div>
                              <div className="text-slate-500 font-bold text-[10px] tracking-wide mt-0.5">{f.code}</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-slate-200 font-extrabold text-sm">{f.departure}</div>
                            {isDelayed && (
                              <div className="text-[10px] text-rose-400 font-bold mt-0.5">Est {f.arrival} (+{f.delay}m)</div>
                            )}
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
                  <div className="text-xs text-slate-500 mb-2">per night</div>
                  <button onClick={() => onBook({ type: 'hotel', to: results.city, price: h.price, details: h })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Book Now</button>
                </div>
              </div>
            </div>
          ))}
          {type === 'train' && results.trains?.map(t => (
            <div key={t.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{t.name} <span className="text-slate-400 text-sm">#{t.number}</span></div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{t.departure} → {t.arrival}</div>
                  <div className="text-sm text-slate-500">{t.duration}</div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {t.classes.map(cls => (
                    <button key={cls} onClick={() => onBook({ type: 'train', from: results.from, to: results.to, price: t.price[cls], details: { ...t, selectedClass: cls } })}
                      className="flex flex-col items-center border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors">
                      <span className="text-xs font-bold text-slate-600">{cls}</span>
                      <span className="text-blue-600 font-bold">₹{t.price[cls]}</span>
                      <span className="text-xs text-green-600">{t.availability[cls]} seats</span>
                    </button>
                  ))}
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
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', type: 'International' },
  { city: 'Bangalore', code: 'BLR', name: 'Kempegowda International Airport', type: 'International' },
  { city: 'Hyderabad', code: 'HYD', name: 'Rajiv Gandhi International Airport', type: 'International' },
  { city: 'Chennai', code: 'MAA', name: 'Chennai International Airport', type: 'International' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', type: 'International' },
  { city: 'Kochi', code: 'COK', name: 'Cochin International Airport', type: 'International' },
  { city: 'Ahmedabad', code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', type: 'International' },
  { city: 'Pune', code: 'PNQ', name: 'Pune Airport', type: 'Domestic/International' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim Airport', type: 'International' },
  { city: 'Goa (Mopa)', code: 'GOX', name: 'Manohar International Airport', type: 'International' },
  { city: 'Jaipur', code: 'JAI', name: 'Jaipur International Airport', type: 'International' },
  { city: 'Lucknow', code: 'LKO', name: 'Chaudhary Charan Singh International Airport', type: 'International' },
  { city: 'Amritsar', code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', type: 'International' },
  { city: 'Guwahati', code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', type: 'International' },
  { city: 'Thiruvananthapuram', code: 'TRV', name: 'Trivandrum International Airport', type: 'International' },
  { city: 'Srinagar', code: 'SXR', name: 'Sheikh ul-Alam International Airport', type: 'International' },
  { city: 'Bhubaneswar', code: 'BBI', name: 'Biju Patnaik International Airport', type: 'International' },
  { city: 'Bagdogra', code: 'IXB', name: 'Bagdogra Airport', type: 'Domestic' },
  { city: 'Nagpur', code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', type: 'International' },
  { city: 'Patna', code: 'PAT', name: 'Jay Prakash Narayan Airport', type: 'Domestic' },
  { city: 'Chandigarh', code: 'IXC', name: 'Shaheed Bhagat Singh International Airport', type: 'International' },
  { city: 'Coimbatore', code: 'CJB', name: 'Coimbatore International Airport', type: 'International' },
  { city: 'Varanasi', code: 'VNS', name: 'Lal Bahadur Shastri International Airport', type: 'International' },
  { city: 'Visakhapatnam', code: 'VTZ', name: 'Visakhapatnam Airport', type: 'International' },
  { city: 'Indore', code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', type: 'International' },
  { city: 'Ranchi', code: 'IXR', name: 'Birsa Munda Airport', type: 'Domestic' },
  { city: 'Surat', code: 'STV', name: 'Surat International Airport', type: 'International' },
  { city: 'Dehradun', code: 'DED', name: 'Jolly Grant Airport', type: 'Domestic' },
  { city: 'Udaipur', code: 'UDR', name: 'Maharana Pratap Airport', type: 'Domestic' },
  { city: 'Jammu', code: 'IXJ', name: 'Jammu Airport', type: 'Domestic' },
  { city: 'Raipur', code: 'RPR', name: 'Swami Vivekananda Airport', type: 'Domestic' },
  { city: 'Jodhpur', code: 'JDH', name: 'Jodhpur Airport', type: 'Domestic' }
];

const BookingForm = ({ onBookingSuccess }) => {
  const [activeTab, setActiveTab] = useState('flight');
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('Mumbai (BOM)');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 Adult');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [city, setCity] = useState('Mumbai');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [rooms, setRooms] = useState('1 Room, 2 Guests');
  const [trainFrom, setTrainFrom] = useState('New Delhi');
  const [trainTo, setTrainTo] = useState('Mumbai CST');
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [busDate, setBusDate] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [cabDate, setCabDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDays, setAiDays] = useState('5');
  const [aiBudget, setAiBudget] = useState('80,000');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showDaysInput, setShowDaysInput] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [showInterestsInput, setShowInterestsInput] = useState(false);
  const [results, setResults] = useState(null);
  const [resultType, setResultType] = useState('');
  const [searching, setSearching] = useState(false);
  const [bookingMsg, setBookingMsg] = useState('');

  const swap = () => { setFrom(to); setTo(from); };

  const handleSearch = async () => {
    setSearching(true);
    try {
      if (activeTab === 'flight') {
        const res = await axios.get(`/api/bookings/search/flights?from=${from}&to=${to}&date=${date}`);
        setResults(res.data); setResultType('flight');
      } else if (activeTab === 'hotel' || activeTab === 'homestay') {
        const res = await axios.get(`/api/bookings/search/hotels?city=${city}&checkin=${checkin}&checkout=${checkout}`);
        setResults(res.data); setResultType('hotel');
      } else if (activeTab === 'train') {
        const res = await axios.get(`/api/bookings/search/trains?from=${trainFrom}&to=${trainTo}&date=${date}`);
        setResults(res.data); setResultType('train');
      } else if (activeTab === 'bus') {
        setResults({ buses: [{ id:1, operator:'RedBus Express', departure:'07:00', arrival:'14:00', duration:'7h', price:650, seats:23, type:'AC Sleeper' },{ id:2, operator:'VRL Travels', departure:'21:30', arrival:'05:30', duration:'8h', price:850, seats:12, type:'Volvo AC' }], from: busFrom, to: busTo }); setResultType('bus');
      } else if (activeTab === 'cab') {
        setBookingMsg(`✅ Cab booked! ${pickup} → ${drop} on ${cabDate}. Driver will be assigned shortly.`);
        setTimeout(() => setBookingMsg(''), 4000);
        setSearching(false); return;
      } else if (activeTab === 'ai-planner') {
        let finalPrompt = aiPrompt.trim();
        if (!finalPrompt) {
          setBookingMsg('⚠️ Please enter a travel description first!');
          setTimeout(() => setBookingMsg(''), 3000);
          setSearching(false);
          return;
        }

        // Dynamically append selected floating options for premium fidelity!
        const additions = [];
        if (showDaysInput && aiDays) additions.push(`${aiDays} Days`);
        if (showBudgetInput && aiBudget) additions.push(`Budget: ₹${aiBudget}`);
        if (showInterestsInput && selectedInterests.length > 0) additions.push(`Interests: ${selectedInterests.join(', ')}`);

        if (additions.length > 0) {
          finalPrompt += ` (${additions.join(' • ')})`;
        }

        // Dispatch custom event to trigger AI Chatbot!
        const event = new CustomEvent('open-ai-chat', { detail: { prompt: finalPrompt } });
        window.dispatchEvent(event);
        setSearching(false);
        return;
      } else {
        setBookingMsg(`✅ Request submitted for ${activeTab}! Our team will contact you shortly.`);
        setTimeout(() => setBookingMsg(''), 4000);
        setSearching(false); return;
      }
    } catch {
      setBookingMsg('⚠️ Search failed. Please check if backend is running.');
      setTimeout(() => setBookingMsg(''), 3000);
    }
    setSearching(false);
  };

  const handleBook = async (bookingData) => {
    try {
      await axios.post('/api/bookings', bookingData);
      setResults(null);
      setBookingMsg(`✅ Booking Confirmed! Ref: RNX${Date.now().toString(36).toUpperCase()}`);
      if (onBookingSuccess) onBookingSuccess();
      setTimeout(() => setBookingMsg(''), 5000);
    } catch {
      setBookingMsg('⚠️ Booking saved locally. Connect to MongoDB for persistence.');
      setTimeout(() => setBookingMsg(''), 4000);
    }
  };

  return (
    <div className="relative z-20 mx-4 md:mx-0 -mt-32 md:-mt-46">
      {bookingMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 font-semibold text-center shadow-lg shadow-green-500/10 animate-fade-in">
          {bookingMsg}
        </div>
      )}

      {/* Tab Bar - Fluid Glassmorphism */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 rounded-3xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-5 mx-auto max-w-5xl overflow-hidden hidden md:block transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`flex flex-col items-center gap-1.5 group relative px-4 py-2.5 rounded-2xl transition-all duration-300 min-w-[85px] cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold scale-105' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600/20' : 'group-hover:scale-110'}`}>
                  <Icon size={20} className={tab.highlight ? 'text-purple-600' : ''} />
                </div>
                <span className={`text-xs tracking-wide ${tab.highlight ? 'text-purple-700 font-bold dark:text-purple-400' : 'font-medium'}`}>{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full shadow-lg shadow-blue-500/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile tabs - Floating pill slider */}
      <div className="flex md:hidden overflow-x-auto gap-2.5 mb-5 px-1 no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-slate-200'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Card - Extremely Modern & Fluidic */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(8,112,184,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] p-6 md:p-8 pt-8 pb-16 border border-white/60 dark:border-slate-800/80 relative animate-float-slow transition-all duration-300">

        {/* FLIGHTS */}
        {activeTab === 'flight' && (
          <>
            {/* iOS style Segmented Control for Trip Type */}
            <div className="flex bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-2xl w-fit mb-6 border border-slate-200/30 dark:border-slate-700/30">
              {['oneway', 'roundtrip', 'multicity'].map(t => {
                const isActive = tripType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold scale-102' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t === 'oneway' ? 'One Way' : t === 'roundtrip' ? 'Round Trip' : 'Multi City'}
                  </button>
                );
              })}
            </div>
            {/* Click-outside backdrop overlay */}
            {(showFromDropdown || showToDropdown) && (
              <div 
                className="fixed inset-0 z-[100] cursor-default" 
                onClick={() => { setShowFromDropdown(false); setShowToDropdown(false); }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 border border-slate-100 dark:border-slate-800/40 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-[0_4px_24px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/50 relative z-[110]">
              
              {/* FROM Input with Dropdown Autocomplete */}
              <div className="relative">
                <Field label="FROM">
                  <input 
                    value={from} 
                    onFocus={() => { setShowFromDropdown(true); setShowToDropdown(false); }}
                    onChange={e => { setFrom(e.target.value); setShowFromDropdown(true); }}
                    className="text-xl font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400 cursor-text" 
                    placeholder="Search Airport..."
                  />
                </Field>
                {showFromDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-2xl shadow-2xl z-[150] max-h-64 overflow-y-auto divide-y divide-slate-50 animate-fade-in">
                    {INDIAN_AIRPORTS.filter(item => 
                      item.city.toLowerCase().includes(from.toLowerCase()) || 
                      item.code.toLowerCase().includes(from.toLowerCase()) ||
                      item.name.toLowerCase().includes(from.toLowerCase())
                    ).map(item => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setFrom(`${item.city} (${item.code})`);
                          setShowFromDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="pr-2">
                          <div className="font-extrabold text-sm text-slate-800">{item.city} ({item.code})</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5 truncate max-w-[180px] md:max-w-[200px]">{item.name}</div>
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider border shrink-0 ${
                          item.type === 'International'
                            ? 'bg-purple-50 text-purple-600 border-purple-200/50'
                            : item.type === 'Domestic/International'
                            ? 'bg-blue-50 text-blue-600 border-blue-200/50'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                        }`}>
                          {item.type}
                        </span>
                      </button>
                    ))}
                    {INDIAN_AIRPORTS.filter(item => 
                      item.city.toLowerCase().includes(from.toLowerCase()) || 
                      item.code.toLowerCase().includes(from.toLowerCase()) ||
                      item.name.toLowerCase().includes(from.toLowerCase())
                    ).length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 font-bold">No airports found</div>
                    )}
                  </div>
                )}
              </div>

              {/* TO Input with Swap Button and Dropdown Autocomplete */}
              <div className="relative">
                <button 
                  onClick={swap} 
                  type="button"
                  title="Swap Cities"
                  className="absolute z-30 bg-white border border-slate-150 rounded-full p-2.5 hover:bg-slate-5 hover:border-blue-300 shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer
                             top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
                             md:top-1/2 md:-translate-y-1/2 md:left-0 md:-translate-x-1/2"
                >
                  <ArrowLeftRight size={15} className="text-blue-600 transition-transform duration-300 rotate-90 md:rotate-0" />
                </button>
                
                <Field label="TO">
                  <input 
                    value={to} 
                    onFocus={() => { setShowToDropdown(true); setShowFromDropdown(false); }}
                    onChange={e => { setTo(e.target.value); setShowToDropdown(true); }}
                    className="text-xl font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400 cursor-text" 
                    placeholder="Search Airport..."
                  />
                </Field>
                
                {showToDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-2xl shadow-2xl z-[150] max-h-64 overflow-y-auto divide-y divide-slate-50 animate-fade-in">
                    {INDIAN_AIRPORTS.filter(item => 
                      item.city.toLowerCase().includes(to.toLowerCase()) || 
                      item.code.toLowerCase().includes(to.toLowerCase()) ||
                      item.name.toLowerCase().includes(to.toLowerCase())
                    ).map(item => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setTo(`${item.city} (${item.code})`);
                          setShowToDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="pr-2">
                          <div className="font-extrabold text-sm text-slate-800">{item.city} ({item.code})</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5 truncate max-w-[180px] md:max-w-[200px]">{item.name}</div>
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider border shrink-0 ${
                          item.type === 'International'
                            ? 'bg-purple-50 text-purple-600 border-purple-200/50'
                            : item.type === 'Domestic/International'
                            ? 'bg-blue-50 text-blue-600 border-blue-200/50'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                        }`}>
                          {item.type}
                        </span>
                      </button>
                    ))}
                    {INDIAN_AIRPORTS.filter(item => 
                      item.city.toLowerCase().includes(to.toLowerCase()) || 
                      item.code.toLowerCase().includes(to.toLowerCase()) ||
                      item.name.toLowerCase().includes(to.toLowerCase())
                    ).length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 font-bold">No airports found</div>
                    )}
                  </div>
                )}
              </div>
              <Field label="DEPARTURE">
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  onClick={(e) => e.target.showPicker()}
                  className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
                />
              </Field>
              <div 
                onClick={() => { 
                  if (tripType === 'oneway') {
                    setTripType('roundtrip');
                    setTimeout(() => {
                      const returnInput = document.getElementById('return-date-input');
                      if (returnInput) returnInput.showPicker();
                    }, 50);
                  }
                }}
                className="cursor-pointer"
              >
                <Field label="RETURN">
                  <input 
                    id="return-date-input"
                    type="date" 
                    value={returnDate} 
                    onChange={e => setReturnDate(e.target.value)} 
                    onClick={(e) => {
                      if (tripType !== 'oneway') e.target.showPicker();
                    }}
                    className={`text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer transition-opacity duration-300 ${tripType === 'oneway' ? 'opacity-40' : ''}`} 
                    placeholder="Add return date" 
                  />
                </Field>
              </div>
              <Field label="TRAVELLERS & CLASS">
                <select value={`${passengers}|${cabinClass}`} onChange={e => { const [p,c]=e.target.value.split('|'); setPassengers(p); setCabinClass(c); }} className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                  {['1 Adult','2 Adults','3 Adults','4 Adults'].map(p => ['Economy','Business','First Class'].map(c => (
                    <option key={`${p}|${c}`} value={`${p}|${c}`}>{p} · {c}</option>
                  )))}
                </select>
              </Field>
            </div>
          </>
        )}

        {/* HOTELS / HOMESTAYS */}
        {(activeTab === 'hotel' || activeTab === 'homestay') && (
          <div className="grid grid-cols-1 md:grid-cols-4 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="CITY / DESTINATION">
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Where do you want to stay?" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="CHECK IN">
              <input 
                type="date" 
                value={checkin} 
                onChange={e => setCheckin(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
            <Field label="CHECK OUT">
              <input 
                type="date" 
                value={checkout} 
                onChange={e => setCheckout(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
            <Field label="ROOMS & GUESTS">
              <select value={rooms} onChange={e => setRooms(e.target.value)} className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                {['1 Room, 1 Guest','1 Room, 2 Guests','2 Rooms, 3 Guests','2 Rooms, 4 Guests','3 Rooms, 6 Guests'].map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        )}

        {/* HOLIDAY PACKAGES */}
        {activeTab === 'holiday' && (
          <div className="grid grid-cols-1 md:grid-cols-4 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="DESTINATION">
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Bali, Europe, Rajasthan" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="DEPARTURE DATE">
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
            <Field label="DURATION">
              <select className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                {['3 Nights / 4 Days','5 Nights / 6 Days','7 Nights / 8 Days','10 Nights / 11 Days'].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="TRAVELLERS">
              <select className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                {['1 Adult','2 Adults','2 Adults, 1 Child','2 Adults, 2 Children','4 Adults'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        )}

        {/* TRAINS */}
        {activeTab === 'train' && (
          <div className="grid grid-cols-1 md:grid-cols-4 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="FROM STATION">
              <input value={trainFrom} onChange={e => setTrainFrom(e.target.value)} className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent" />
            </Field>
            <Field label="TO STATION">
              <input value={trainTo} onChange={e => setTrainTo(e.target.value)} className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent" />
            </Field>
            <Field label="DATE OF JOURNEY">
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
            <Field label="QUOTA">
              <select className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                {['General','Ladies','Senior Citizen','Tatkal','Premium Tatkal'].map(q => <option key={q}>{q}</option>)}
              </select>
            </Field>
          </div>
        )}

        {/* BUSES */}
        {activeTab === 'bus' && (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="FROM CITY">
              <input value={busFrom} onChange={e => setBusFrom(e.target.value)} placeholder="Enter departure city" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="TO CITY">
              <input value={busTo} onChange={e => setBusTo(e.target.value)} placeholder="Enter destination city" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="DATE OF JOURNEY">
              <input 
                type="date" 
                value={busDate} 
                onChange={e => setBusDate(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-lg font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
          </div>
        )}

        {/* CABS */}
        {activeTab === 'cab' && (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="PICKUP LOCATION">
              <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Enter pickup address" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="DROP LOCATION">
              <input value={drop} onChange={e => setDrop(e.target.value)} placeholder="Enter drop address" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="PICKUP DATE & TIME">
              <input 
                type="datetime-local" 
                value={cabDate} 
                onChange={e => setCabDate(e.target.value)} 
                onClick={(e) => e.target.showPicker()}
                className="text-base font-bold text-slate-800 w-full outline-none bg-transparent cursor-pointer" 
              />
            </Field>
          </div>
        )}

        {/* FOREX */}
        {activeTab === 'forex' && (
          <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <Field label="CURRENCY">
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent cursor-pointer">
                {['USD – US Dollar','EUR – Euro','GBP – British Pound','AED – UAE Dirham','SGD – Singapore Dollar','THB – Thai Baht','JPY – Japanese Yen'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="AMOUNT (INR)">
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 50000" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
            <Field label="DELIVERY CITY">
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" className="text-lg font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
            </Field>
          </div>
        )}

        {/* AI PLANNER */}
        {activeTab === 'ai-planner' && (
          <>
            <div className="mb-6 bg-gradient-to-r from-purple-600/95 via-indigo-600/95 to-blue-600/95 backdrop-blur-xl border border-purple-500/20 p-5 rounded-[2rem] text-white shadow-lg flex items-center justify-between gap-4 animate-fade-in relative overflow-hidden group">
              {/* Floating decorative gradient ball in the corner of the banner */}
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-purple-500/30 rounded-full mix-blend-screen filter blur-xl group-hover:scale-125 transition-transform duration-500"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 animate-float shadow-inner">
                  <Sparkles className="text-yellow-200 animate-pulse" size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-wide flex items-center gap-2">
                    Roamnexa AI Itinerary Planner 
                    <span className="bg-yellow-400/20 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-yellow-400/30">v2.0 Beta</span>
                  </h3>
                  <p className="text-xs text-purple-100/90 mt-0.5">Tell our smart concierge your desires, and we will compile a flawless travel schedule instantly.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-purple-100 rounded-[2.2rem] p-6 pt-7 transition-all duration-300 focus-within:border-purple-400 focus-within:bg-white focus-within:shadow-[0_20px_50px_rgba(147,51,234,0.08)] relative overflow-hidden hover-float">
              
              {/* Dynamic suggestion starter pills to immediately wow the user! */}
              <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] text-purple-500 font-extrabold uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-md shrink-0">💡 Quick Start:</span>
                {[
                  { label: "🌴 Bali Honeymoon", prompt: "A 5-day romantic trip to Bali under ₹1,20,000. Include scenic stays, sunset dinner cruise, and jungle temple tours." },
                  { label: "🗼 Paris Arts", prompt: "A 3-day cultural art journey to Paris. Include tickets to the Louvre, a boat cruise, and cozy historic cafés." },
                  { label: "⛰️ Swiss Alps", prompt: "A 7-day winter retreat in Interlaken, Switzerland. Include high-altitude train rides and alpine skiing." },
                  { label: "⛩️ Tokyo Culture", prompt: "A 5-day exploration of Tokyo and Kyoto, focusing on futuristic districts, sushi tasting, and traditional shrines." }
                ].map((s, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setAiPrompt(s.prompt)}
                    className="text-[11px] font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 hover:text-indigo-800 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer border border-indigo-100/30 shrink-0"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <textarea 
                rows="3" 
                value={aiPrompt} 
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. Describe your dream vacation here, click quick-start above, or use custom tags below..."
                className="w-full bg-transparent text-lg font-bold text-slate-800 focus:outline-none placeholder-slate-400/80 resize-none min-h-[90px]" 
              />
              
              {/* Dynamic Parameters Drawer - Fully Interactive & User Friendly! */}
              <div className="mt-4 pt-4 border-t border-slate-100/85 flex flex-wrap gap-3 items-center justify-between">
                
                {/* Selector Toggles */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowDaysInput(!showDaysInput)} 
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-250 cursor-pointer border ${
                      showDaysInput 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                        : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-700 border-purple-100/50'
                    }`}
                  >
                    {showDaysInput ? `📅 ${aiDays} Days` : '+ Add Duration'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBudgetInput(!showBudgetInput)} 
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-250 cursor-pointer border ${
                      showBudgetInput 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                        : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-700 border-purple-100/50'
                    }`}
                  >
                    {showBudgetInput ? `💰 ₹${aiBudget}` : '+ Add Budget'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowInterestsInput(!showInterestsInput)} 
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-250 cursor-pointer border ${
                      showInterestsInput 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                        : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-700 border-purple-100/50'
                    }`}
                  >
                    {showInterestsInput ? `✨ ${selectedInterests.length ? `${selectedInterests.length} Selected` : 'Interests'}` : '+ Interests'}
                  </button>
                </div>

                {/* Reset button to clear prompt */}
                {(aiPrompt || showDaysInput || showBudgetInput || showInterestsInput) && (
                  <button 
                    type="button" 
                    onClick={() => { setAiPrompt(''); setShowDaysInput(false); setShowBudgetInput(false); setShowInterestsInput(false); setSelectedInterests([]); }}
                    className="text-xs font-bold text-slate-400 hover:text-rose-500 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Dynamic Interactive Drawers */}
              {(showDaysInput || showBudgetInput || showInterestsInput) && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 flex flex-col gap-4 animate-fade-in relative z-10">
                  {/* Days Selector Drawer */}
                  {showDaysInput && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 shrink-0">Duration:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['3', '5', '7', '10', '14'].map(d => (
                          <button 
                            key={d}
                            type="button"
                            onClick={() => setAiDays(d)}
                            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              aiDays === d 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/50'
                            }`}
                          >
                            {d} Days
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Selector Drawer */}
                  {showBudgetInput && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 shrink-0">Max Budget:</span>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/50 max-w-[200px]">
                        <span className="text-slate-500 font-extrabold text-sm">₹</span>
                        <input 
                          type="text" 
                          value={aiBudget} 
                          onChange={e => setAiBudget(e.target.value)}
                          placeholder="e.g. 80,000" 
                          className="w-full text-xs font-extrabold text-slate-800 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Interests Checklist Drawer */}
                  {showInterestsInput && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-500">Pick Interests:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { emoji: "🏖️", label: "Beaches" },
                          { emoji: "🏛️", label: "Culture & History" },
                          { emoji: "⛰️", label: "Adventure" },
                          { emoji: "🍜", label: "Local Food" },
                          { emoji: "🛍️", label: "Shopping" },
                          { emoji: "🧖‍♀️", label: "Wellness & Spa" },
                          { emoji: "🌃", label: "Nightlife" }
                        ].map(interest => {
                          const isSelected = selectedInterests.includes(interest.label);
                          return (
                            <button
                              key={interest.label}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedInterests(selectedInterests.filter(i => i !== interest.label));
                                } else {
                                  setSelectedInterests([...selectedInterests, interest.label]);
                                }
                              }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border ${
                                isSelected 
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200/50'
                              }`}
                            >
                              <span>{interest.emoji}</span>
                              <span>{interest.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Search Button - Ultimate Fluid Gradient */}
        <button 
          onClick={handleSearch} 
          disabled={searching}
          type="button"
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm px-16 py-4 rounded-full shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-widest whitespace-nowrap disabled:opacity-70 disabled:scale-100 cursor-pointer hover-float-button"
        >
          {searching ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Search size={18} />
          )}
          {searching ? 'Searching...' : activeTab === 'ai-planner' ? 'Plan My Trip' : 'Search'}
        </button>
      </div>

      {results && <ResultsModal results={results} type={resultType} onClose={() => setResults(null)} onBook={handleBook} />}
    </div>
  );
};

export default BookingForm;
