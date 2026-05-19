import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Info, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  
  // Auth steps: 'email_input' -> 'password_entry'
  const [step, setStep] = useState('email_input'); 
  const [emailInput, setEmailInput] = useState('');
  
  // Registration / Authentication states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset states on close / open
  useEffect(() => {
    if (!isOpen) {
      setStep('email_input');
      setEmailInput('');
      setName('');
      setPassword('');
      setPhone('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinueWithEmail = (e) => {
    e.preventDefault();
    setError('');
    
    // Quick validation
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setStep('password_entry');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      if (emailInput === 'guest_demo@roamnexa.com') {
        // Quick demo login bypass
        await login(emailInput, 'guest_pass_123');
        setSuccess('Logged in successfully!');
      } else {
        // Decide between login and signup dynamically
        try {
          // Attempt Login
          await login(emailInput, password);
          setSuccess('Logged in successfully!');
        } catch (loginErr) {
          // If login fails, assume it's a new account signup
          if (!name.trim()) {
            setError('Account not found. Please enter your Full Name to register.');
            setLoading(false);
            return;
          }
          await register(name, emailInput, password, phone);
          setSuccess('Welcome! Account created successfully.');
        }
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      {/* Splitscreen Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-slate-200/50 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row transition-all duration-500 min-h-[500px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button (top-right of entire container) */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* LEFT PANEL: SIGN IN / REGISTER FORM (7 columns) */}
        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col justify-center">
          
          {/* Header Title & Badges */}
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Sign in/register</h2>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 text-[10px]">🪙</span>
                Membership rewards
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 text-[10px]">✓</span>
                Manage bookings with ease
              </span>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl px-4 py-3 mb-5 text-sm font-bold">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 mb-5 text-sm font-bold flex items-center gap-2">
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}

          {step === 'email_input' ? (
            /* ================= STEP 1: EMAIL ADDRESS INPUT ================= */
            <div>
              <form onSubmit={handleContinueWithEmail} className="space-y-4">
                <div className="relative">
                  <input 
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="Please enter an email address"
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    emailInput.trim() 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/10' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue with email
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>

              {/* OAuth Social Buttons (Trip.com exact layout styling) */}
              <div className="space-y-3">
                <button 
                  onClick={() => { setEmailInput('guest_demo@roamnexa.com'); setStep('password_entry'); }}
                  className="w-full py-3.5 bg-[#4285f4] hover:bg-[#357ae8] text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm"
                >
                  <img src="https://images.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5 rounded-full bg-white p-0.5 object-contain" />
                  Continue with Google
                </button>

                <button className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-850 dark:text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm">
                  <span className="text-base"></span>
                  Continue with Apple
                </button>

                <button className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-850 dark:text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm">
                  <span className="text-blue-600 text-base font-black">f</span>
                  Continue with Facebook
                </button>

                <button className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-850 dark:text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm">
                  <span className="text-emerald-500 text-sm">💬</span>
                  Continue with WeChat
                </button>
              </div>

              {/* Policy footer */}
              <p className="mt-8 text-[11px] font-bold text-slate-400 leading-relaxed text-center md:text-left">
                By signing in or registering, you are deemed to have agreed to the Roamnexa{' '}
                <a href="#terms" className="text-blue-500 hover:underline">Terms and Conditions</a>{' '}
                and <a href="#privacy" className="text-blue-500 hover:underline">Privacy Statement</a>.
              </p>
            </div>
          ) : (
            /* ================= STEP 2: PASSWORD ENTRY / ACCOUNT REGISTRATION ================= */
            <div>
              {/* Back button */}
              <button 
                onClick={() => { setStep('email_input'); setError(''); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
              >
                &larr; Use another email
              </button>

              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 mb-6">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Logging in as:</span>
                <span className="text-sm font-extrabold text-slate-850 dark:text-white truncate block">{emailInput}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Collect Full Name dynamically if it is a new account */}
                {emailInput !== 'guest_demo@roamnexa.com' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name (Only required for registration)</span>
                      <input 
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                    <div className="relative">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Phone Number (Optional)</span>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Password</span>
                  <div className="relative">
                    <input 
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={emailInput === 'guest_demo@roamnexa.com' ? 'Pre-filled demo passcode' : '••••••••'}
                      disabled={emailInput === 'guest_demo@roamnexa.com'}
                      className="w-full bg-transparent border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white outline-none pr-10"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all cursor-pointer text-sm uppercase tracking-wider mt-2"
                >
                  {loading ? 'Please wait...' : 'Verify & Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: APP QR CODE SIGN IN (5 columns) */}
        <div className="w-full md:w-[42%] bg-slate-50 dark:bg-slate-800/40 p-8 md:p-12 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
          
          {/* Custom rendered dynamic SVG QR Code with central Roamnexa brand icon */}
          <div className="relative w-48 h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-md mb-6 hover:scale-103 transition-transform duration-300">
            <svg 
              className="w-full h-full text-slate-800 dark:text-white" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Position Squares */}
              <rect x="0" y="0" width="22" height="22" rx="3" fill="currentColor" />
              <rect x="3" y="3" width="16" height="16" rx="2" fill="white" className="dark:fill-slate-900" />
              <rect x="6" y="6" width="10" height="10" rx="1.5" fill="currentColor" />

              <rect x="78" y="0" width="22" height="22" rx="3" fill="currentColor" />
              <rect x="81" y="3" width="16" height="16" rx="2" fill="white" className="dark:fill-slate-900" />
              <rect x="84" y="6" width="10" height="10" rx="1.5" fill="currentColor" />

              <rect x="0" y="78" width="22" height="22" rx="3" fill="currentColor" />
              <rect x="3" y="81" width="16" height="16" rx="2" fill="white" className="dark:fill-slate-900" />
              <rect x="6" y="84" width="10" height="10" rx="1.5" fill="currentColor" />

              {/* Smaller alignment squares */}
              <rect x="74" y="74" width="8" height="8" fill="currentColor" />
              
              {/* Random simulated QR pattern blocks */}
              <rect x="28" y="0" width="6" height="6" fill="currentColor" />
              <rect x="40" y="4" width="6" height="6" fill="currentColor" />
              <rect x="52" y="0" width="6" height="6" fill="currentColor" />
              <rect x="64" y="8" width="6" height="6" fill="currentColor" />

              <rect x="0" y="28" width="6" height="6" fill="currentColor" />
              <rect x="8" y="40" width="6" height="6" fill="currentColor" />
              <rect x="16" y="52" width="6" height="6" fill="currentColor" />
              <rect x="20" y="64" width="6" height="6" fill="currentColor" />

              <rect x="88" y="28" width="6" height="6" fill="currentColor" />
              <rect x="94" y="40" width="6" height="6" fill="currentColor" />
              <rect x="80" y="52" width="6" height="6" fill="currentColor" />
              <rect x="86" y="64" width="6" height="6" fill="currentColor" />

              <rect x="28" y="88" width="6" height="6" fill="currentColor" />
              <rect x="40" y="80" width="6" height="6" fill="currentColor" />
              <rect x="52" y="94" width="6" height="6" fill="currentColor" />
              <rect x="64" y="86" width="6" height="6" fill="currentColor" />

              {/* Center space mask */}
              <rect x="26" y="26" width="48" height="48" rx="10" fill="white" className="dark:fill-slate-900" />
            </svg>

            {/* Central Brand Logo Badge exactly like Trip.com */}
            <div className="absolute inset-0 m-auto w-16 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-white dark:border-slate-800 scale-90">
              <span className="text-[10px] font-black text-white tracking-tighter uppercase leading-none">roam</span>
            </div>
          </div>

          <h3 className="text-base font-black text-slate-800 dark:text-white text-center px-4 leading-snug">
            Use the Roamnexa app to sign in with a QR code
          </h3>

          {/* Stepper details */}
          <div className="mt-6 space-y-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 w-full max-w-[240px]">
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-700 text-[10px] flex items-center justify-center shrink-0">1</span>
              <span>Open the Roamnexa app</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-700 text-[10px] flex items-center justify-center shrink-0">2</span>
              <span>Go to <strong className="text-slate-800 dark:text-white">Account</strong></span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-700 text-[10px] flex items-center justify-center shrink-0">3</span>
              <span>
                Tap the scan icon in the top-right corner or go to{' '}
                <strong className="text-slate-800 dark:text-white">(Settings) &gt; Scan QR code</strong>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
