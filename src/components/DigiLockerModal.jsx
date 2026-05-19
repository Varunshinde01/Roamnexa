import React, { useState } from 'react';
import { X, Shield, Lock, FileText, CheckCircle, Download, Upload, ArrowRight, RefreshCw, Key } from 'lucide-react';

const DigiLockerModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Indian Passport', type: 'PDF', size: '1.2 MB', source: 'Ministry of External Affairs', date: '2026-05-10', verified: true },
    { id: '2', name: 'Aadhaar Card', type: 'PDF', size: '450 KB', source: 'UIDAI', date: '2026-05-12', verified: true },
    { id: '3', name: 'Driving License', type: 'PDF', size: '620 KB', source: 'Ministry of Road Transport', date: '2026-05-15', verified: true }
  ]);

  if (!isOpen) return null;

  const handleConnect = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (aadhaarNum.length < 12) {
        alert('Please enter a valid 12-digit Aadhaar Number or DigiLocker Username');
        return;
      }
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setOtpSent(true);
      }, 1500);
    } else {
      if (otpVal.length < 6) {
        alert('Please enter a valid 6-digit verification code');
        return;
      }
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 1800);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setDocuments(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: file.name,
          type: file.name.split('.').pop().toUpperCase(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          source: 'User Upload (Self-Attested)',
          date: new Date().toISOString().split('T')[0],
          verified: false
        }
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-white/40 dark:border-slate-800 p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wide">Document Vault</h2>
              <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 px-2 py-0.5 rounded">DigiLocker Secured</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Access verified government documents, flight tickets &amp; visa vouchers in real-time</p>
          </div>
        </div>

        {!isConnected ? (
          /* Connecting flow container */
          <div className="py-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 animate-pulse">
              <Lock size={30} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Connect your DigiLocker</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Authorize Roamnexa to verify your Passport, Visa, and identification cards directly from the Govt. of India secure document repository.
            </p>

            <form onSubmit={handleConnect} className="space-y-4">
              {!otpSent ? (
                <div>
                  <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Aadhaar Card Number / DigiLocker ID</label>
                  <div className="relative">
                    <input 
                      type="text"
                      maxLength={12}
                      value={aadhaarNum}
                      onChange={e => setAadhaarNum(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 12-digit Aadhaar Number"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3.5 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-center text-lg tracking-widest"
                      required
                    />
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-3 mb-4 text-xs font-bold flex items-center gap-2 justify-center">
                    <CheckCircle size={14} /> One-Time Code (OTP) sent to UIDAI registered mobile number Ending 5849
                  </div>
                  <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Enter OTP Verification Code</label>
                  <input 
                    type="text"
                    maxLength={6}
                    value={otpVal}
                    onChange={e => setOtpVal(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Code"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3.5 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-center text-lg tracking-[0.6em]"
                    required
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-101 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Securing Connection...
                  </>
                ) : (
                  <>
                    {otpSent ? 'Verify & Link Account' : 'Request Secure OTP'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Vault Dashboard UI */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-3xl p-5 gap-4">
              <div className="flex gap-3 items-center">
                <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <div className="font-extrabold text-sm text-slate-800 dark:text-white">DigiLocker Linked Successfully</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">Govt. Verification Token: DL-99238-XJA8</div>
                </div>
              </div>
              <button 
                onClick={() => { setIsConnected(false); setOtpSent(false); setAadhaarNum(''); setOtpVal(''); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer self-start sm:self-center"
              >
                Disconnect DigiLocker
              </button>
            </div>

            {/* Document list */}
            <div>
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Linked Verified Documents</h4>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
                    className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-xs shrink-0">
                        {doc.type}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                          {doc.name}
                          {doc.verified && <CheckCircle size={14} className="text-emerald-500" title="DigiLocker Verified" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {doc.source} • {doc.size} • {doc.date}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Simulated Download of ${doc.name}`)}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all cursor-pointer hover:scale-105"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom file upload simulation */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center hover:border-blue-500 transition-colors relative">
              <input 
                type="file" 
                id="vault-file"
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={uploading}
              />
              <label htmlFor="vault-file" className="cursor-pointer block">
                <Upload size={28} className="text-slate-400 mx-auto mb-2" />
                <div className="font-extrabold text-sm text-slate-800 dark:text-white">Upload New Document to Vault</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">Upload PDF, PNG or JPEG (Max 5MB)</div>
              </label>

              {uploading && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 rounded-3xl flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="animate-spin text-blue-600" size={24} />
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Encrypting &amp; Securing Upload...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigiLockerModal;
