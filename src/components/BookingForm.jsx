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
  <div className="p-4 hover:bg-blue-50 transition-colors cursor-pointer">
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
    {children}
  </div>
);

const ResultsModal = ({ results, type, onClose, onBook }) => {
  if (!results) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            {type === 'flight' ? `✈️ Flights: ${results.from} → ${results.to}` :
             type === 'hotel' ? `🏨 Hotels in ${results.city}` :
             `🚂 Trains: ${results.from} → ${results.to}`}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-3">
          {type === 'flight' && results.flights?.map(f => (
            <div key={f.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="font-bold text-slate-800">{f.airline} <span className="text-slate-400 text-sm font-normal">({f.code})</span></div>
                <div className="text-2xl font-black text-slate-900 mt-1">{f.departure} <span className="text-slate-400 text-base font-normal">→</span> {f.arrival}</div>
                <div className="text-sm text-slate-500">{f.duration} • {f.stops} • {f.baggage}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-600">₹{f.price.toLocaleString()}</div>
                <div className="text-xs text-slate-500 mb-2">{f.class}</div>
                <button onClick={() => onBook({ type: 'flight', from: results.from, to: results.to, price: f.price, details: f })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Book Now</button>
              </div>
            </div>
          ))}
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

const BookingForm = ({ onBookingSuccess }) => {
  const [activeTab, setActiveTab] = useState('flight');
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('Mumbai (BOM)');
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
        if (!aiPrompt.trim()) {
          setBookingMsg('⚠️ Please enter a travel description first!');
          setTimeout(() => setBookingMsg(''), 3000);
          setSearching(false);
          return;
        }
        // Dispatch custom event to trigger AI Chatbot!
        const event = new CustomEvent('open-ai-chat', { detail: { prompt: aiPrompt } });
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
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] mb-5 mx-auto max-w-5xl overflow-hidden hidden md:block">
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
                    ? 'bg-blue-600/10 text-blue-600 font-bold scale-105' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600/20' : 'group-hover:scale-110'}`}>
                  <Icon size={20} className={tab.highlight ? 'text-purple-600' : ''} />
                </div>
                <span className={`text-xs tracking-wide ${tab.highlight ? 'text-purple-700 font-bold' : 'font-medium'}`}>{tab.label}</span>
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
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Card - Extremely Modern & Fluidic */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(8,112,184,0.08)] p-6 md:p-8 pt-8 pb-16 border border-white/60 relative">

        {/* FLIGHTS */}
        {activeTab === 'flight' && (
          <>
            {/* iOS style Segmented Control for Trip Type */}
            <div className="flex bg-slate-100/70 p-1 rounded-2xl w-fit mb-6 border border-slate-200/30">
              {['oneway', 'roundtrip', 'multicity'].map(t => {
                const isActive = tripType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? 'bg-white text-blue-600 shadow-sm font-extrabold scale-102' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t === 'oneway' ? 'One Way' : t === 'roundtrip' ? 'Round Trip' : 'Multi City'}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(15,23,42,0.02)] divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <Field label="FROM">
                <input value={from} onChange={e => setFrom(e.target.value)} className="text-xl font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
              </Field>
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
                  <input value={to} onChange={e => setTo(e.target.value)} className="text-xl font-extrabold text-slate-800 w-full outline-none bg-transparent placeholder-slate-400" />
                </Field>
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
            <div className="mb-5 bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md flex items-center gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm animate-pulse">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Roamnexa AI Itinerary Planner</h3>
                <p className="text-xs text-purple-100 mt-0.5">Describe your dream vacation, and our smart agent will draft a complete travel schedule.</p>
              </div>
            </div>
            <div className="bg-slate-50/50 hover:bg-slate-50 border-2 border-purple-200/70 focus-within:border-purple-500 focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(147,51,234,0.08)] rounded-3xl p-6 transition-all duration-300 relative overflow-hidden">
              <textarea 
                rows="3" 
                value={aiPrompt} 
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. A 5-day romantic trip to Bali under ₹80,000. Include luxury stays and a sunset cruise."
                className="w-full bg-transparent text-lg font-medium text-slate-800 focus:outline-none placeholder-slate-400 resize-none" 
              />
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => setAiPrompt("A 3-day family trip to Paris under €1500.")} className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border border-purple-100/50 cursor-pointer">+ Add Dates</button>
                <button type="button" onClick={() => setAiPrompt(prev => prev + " Limit the budget.")} className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border border-purple-100/50 cursor-pointer">+ Add Budget</button>
                <button type="button" onClick={() => setAiPrompt(prev => prev + " Recommend sightseeing.")} className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border border-purple-100/50 cursor-pointer">+ Interests</button>
              </div>
            </div>
          </>
        )}

        {/* Search Button - Ultimate Fluid Gradient */}
        <button 
          onClick={handleSearch} 
          disabled={searching}
          type="button"
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm px-16 py-4 rounded-full shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 uppercase tracking-widest whitespace-nowrap disabled:opacity-70 disabled:scale-100 cursor-pointer"
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
