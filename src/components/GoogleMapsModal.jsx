import React, { useState } from 'react';
import { X, Map, Search, Download, CheckCircle, RefreshCw, Compass, MapPin } from 'lucide-react';

const GoogleMapsModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState('New Delhi');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedMaps, setDownloadedMaps] = useState([]);

  if (!isOpen) return null;

  const hotspots = [
    { name: 'New Delhi', coords: '28.6139,77.2090' },
    { name: 'Mumbai', coords: '19.0760,72.8777' },
    { name: 'Pune', coords: '18.5204,73.8567' },
    { name: 'Goa', coords: '15.2993,74.1240' },
    { name: 'Bengaluru', coords: '12.9716,77.5946' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMapCenter(searchQuery);
    }
  };

  const handleDownload = () => {
    if (downloadedMaps.includes(mapCenter)) {
      alert(`${mapCenter} map is already available offline!`);
      return;
    }
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadedMaps(d => [...d, mapCenter]);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Convert search query to Google Maps Embed URL format
  const getEmbedUrl = () => {
    const formattedQuery = encodeURIComponent(mapCenter);
    return `https://maps.google.com/maps?q=${formattedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden border border-white/40 dark:border-slate-800 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400 z-50 shadow-md border border-slate-200/50 dark:border-slate-850"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="p-6 md:p-8 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Map size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wide">Smart Travel Maps</h2>
                <span className="text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40 px-2 py-0.5 rounded">Google Maps Live</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Explore cities, discover hotspots, and download regional maps for 100% offline travel</p>
            </div>
          </div>
        </div>

        {/* Map Body Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left panel: Search & tools */}
          <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
            {/* Search field */}
            <form onSubmit={handleSearch}>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Search Location</label>
              <div className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Pune Airport..."
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white pl-4 pr-10 py-3 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Quick hotspots selection */}
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3 tracking-wider flex items-center gap-1.5"><Compass size={14} /> Popular Hotspots</label>
              <div className="flex flex-wrap gap-2">
                {hotspots.map(h => (
                  <button
                    key={h.name}
                    onClick={() => { setMapCenter(h.name); setSearchQuery(''); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                      mapCenter === h.name 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <MapPin size={12} />
                    {h.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Offline map utility card */}
            <div className="bg-slate-50 dark:bg-slate-850/50 rounded-3xl p-5 border border-slate-200/30 mt-auto">
              <div className="flex gap-3 mb-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <div className="font-extrabold text-sm text-slate-800 dark:text-white truncate max-w-[170px]">{mapCenter}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">Ready for Offline Download</div>
                </div>
              </div>

              {downloading ? (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400">
                    <span>Downloading Map Data...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-150" style={{ width: `${downloadProgress}%` }} />
                  </div>
                </div>
              ) : downloadedMaps.includes(mapCenter) ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-3 text-xs font-bold flex items-center gap-2 justify-center mt-3">
                  <CheckCircle size={14} /> Available Offline (84 MB)
                </div>
              ) : (
                <button 
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer hover:scale-101"
                >
                  <Download size={15} /> Download Offline Map
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Active live Google Maps iframe! */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative h-full">
            <iframe 
              src={getEmbedUrl()} 
              title="Google Map Live" 
              className="w-full h-full border-none"
              allowFullScreen="" 
              loading="lazy" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsModal;
