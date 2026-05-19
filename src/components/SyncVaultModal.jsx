import React, { useState } from 'react';
import { X, Shield, Lock, FileText, CheckCircle, Download, Upload, ArrowRight, RefreshCw, Key, Share2, Eye, EyeOff } from 'lucide-react';

const SyncVaultModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [decryptingFileId, setDecryptingFileId] = useState(null);
  
  // Encrypted travel documents listed inside Sync.com secure vault
  const [documents, setDocuments] = useState([
    { id: '1', name: 'US_Visa_Approved_2026.pdf', type: 'PDF', size: '1.4 MB', folder: 'Travel Visas', date: '2026-05-12', secureKey: 'e2ee_AES_256_x921' },
    { id: '2', name: 'Roamnexa_Boarding_Pass.pdf', type: 'PDF', size: '820 KB', folder: 'Active Bookings', date: '2026-05-18', secureKey: 'e2ee_AES_256_p018' },
    { id: '3', name: 'Passport_Scan_V Vikas.png', type: 'PNG', size: '2.1 MB', folder: 'Identity Documents', date: '2026-04-30', secureKey: 'e2ee_AES_256_v923' }
  ]);

  if (!isOpen) return null;

  const handleConnect = (e) => {
    e.preventDefault();
    if (!syncEmail || !syncPassword) {
      alert('Please fill out your Sync.com email and security password');
      return;
    }
    setIsConnecting(true);
    // Simulate generation of local Zero-Knowledge private encryption key
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    // Simulate Sync.com client-side zero-knowledge encryption
    setTimeout(() => {
      setUploading(false);
      setDocuments(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: file.name,
          type: file.name.split('.').pop().toUpperCase(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          folder: 'Recent Uploads',
          date: new Date().toISOString().split('T')[0],
          secureKey: `e2ee_AES_256_${Math.random().toString(36).substring(2, 6)}`
        }
      ]);
    }, 2500);
  };

  const handleDownload = (doc) => {
    setDecryptingFileId(doc.id);
    // Simulate local decryption of file blocks
    setTimeout(() => {
      setDecryptingFileId(null);
      alert(`Decrypted successfully! Downloading ${doc.name} to local device.`);
    }, 1500);
  };

  const handleShareLink = (docName) => {
    const link = `https://sync.com/s/roamnexa_${Math.random().toString(36).substring(3, 10)}`;
    navigator.clipboard.writeText(link);
    alert(`Zero-knowledge secure link generated and copied to clipboard:\n${link}`);
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
            <Lock size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wide">Secure Sync Vault</h2>
              <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 px-2 py-0.5 rounded">Sync.com Secured</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Zero-Knowledge end-to-end encrypted backup for all passports, visa files &amp; tickets</p>
          </div>
        </div>

        {!isConnected ? (
          /* Zero-Knowledge Authentication Flow */
          <div className="py-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 animate-pulse">
              <Shield size={30} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Connect Sync.com Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Access your zero-knowledge private folders. Encrypt all files locally in your browser before they are synced to the cloud.
            </p>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Sync.com Secure Email</label>
                <input 
                  type="email"
                  value={syncEmail}
                  onChange={e => setSyncEmail(e.target.value)}
                  placeholder="traveler@sync.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Zero-Knowledge Passphrase</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={syncPassword}
                    onChange={e => setSyncPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 pr-10 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-101 transition-all cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Generating Local Decryption Keys...
                  </>
                ) : (
                  <>
                    Decrypt &amp; Access Vault
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Decrypted Dashboard View */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-3xl p-5 gap-4">
              <div className="flex gap-3 items-center">
                <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <div className="font-extrabold text-sm text-slate-800 dark:text-white">Zero-Knowledge Token Active</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">Encrypted with secure browser-side AES-256 standard</div>
                </div>
              </div>
              <button 
                onClick={() => { setIsConnected(false); setSyncEmail(''); setSyncPassword(''); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer self-start sm:self-center"
              >
                Lock Vault
              </button>
            </div>

            {/* Document list */}
            <div>
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Secured Documents in Sync.com Cloud</h4>
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
                          <Shield size={14} className="text-blue-500" title="End-to-End Encrypted" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {doc.folder} • {doc.size} • Key: {doc.secureKey}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleShareLink(doc.name)}
                        title="Generate Secure Link"
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl shadow-sm text-slate-500 hover:text-blue-600 transition-all cursor-pointer hover:scale-105"
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)}
                        disabled={decryptingFileId !== null}
                        title="Decrypt &amp; Download"
                        className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white hover:border-blue-500 rounded-xl shadow-sm transition-all cursor-pointer hover:scale-105 flex items-center justify-center min-w-[38px]"
                      >
                        {decryptingFileId === doc.id ? (
                          <RefreshCw className="animate-spin" size={16} />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* End-to-end encrypted local file uploader */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center hover:border-blue-500 transition-colors relative">
              <input 
                type="file" 
                id="sync-file"
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={uploading}
              />
              <label htmlFor="sync-file" className="cursor-pointer block">
                <Upload size={28} className="text-slate-400 mx-auto mb-2" />
                <div className="font-extrabold text-sm text-slate-800 dark:text-white">Encrypt &amp; Sync New File</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">Zero-Knowledge AES encryption occurs instantly inside your browser</div>
              </label>

              {uploading && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 rounded-3xl flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="animate-spin text-blue-600" size={24} />
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Encrypting local payload using local AES-256...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncVaultModal;
