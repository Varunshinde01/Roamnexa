import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, ArrowLeft, Eye, EyeOff, User, CheckCircle, Briefcase, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  
  // Segment state: 'personal' vs 'mybiz'
  const [accountType, setAccountType] = useState('personal'); 
  
  // Auth screen state
  const [step, setStep] = useState(1); // 1 = Entry field, 2 = Details / Verification
  const [usernameInput, setUsernameInput] = useState('');
  
  // Form details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otpMode, setOtpMode] = useState(true); // true = MMT OTP entry, false = password entry
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Countdown timer for simulated OTP
  useEffect(() => {
    let t;
    if (step === 2 && otpMode && otpTimer > 0) {
      t = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [step, otpMode, otpTimer]);

  if (!isOpen) return null;

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');
    if (!usernameInput.trim()) {
      setError('Please enter a valid Mobile Number or Email ID');
      return;
    }
    // Advance to verification / registration details step
    setOtpTimer(30);
    setStep(2);
  };

  const handleOtpChange = (val, index) => {
    const cleanVal = val.replace(/\D/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = cleanVal;
    setOtpValues(newOtp);

    // Focus next input automatically
    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otpValues];
        newOtp[index - 1] = '';
        setOtpValues(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    const emailPayload = usernameInput.includes('@') ? usernameInput : `${usernameInput}@roamnexa.com`;
    const passwordPayload = otpMode ? otpValues.join('') : password;

    if (otpMode && passwordPayload.length < 4) {
      setError('Please enter the 4-digit verification code');
      setLoading(false);
      return;
    }

    try {
      if (otpMode) {
        // Simulated MMT OTP Login Flow (Automatically creates account or logs in)
        try {
          await login(emailPayload, 'otp_default_pass_1234');
          setSuccess('Welcome back! OTP verified successfully.');
        } catch {
          // If login fails, register the account directly (Simulating MMT's instant OTP auto-signup)
          await register(name || 'Traveler', emailPayload, 'otp_default_pass_1234', phone);
          setSuccess('Account created! Welcome to Roamnexa.');
        }
      } else {
        // Standard Password Login / Signup Flow
        if (name) {
          // Signup Mode
          await register(name, emailPayload, passwordPayload, phone);
          setSuccess('Account created successfully!');
        } else {
          // Login Mode
          await login(emailPayload, passwordPayload);
          setSuccess('Logged in successfully!');
        }
      }
      
      setTimeout(() => { 
        setSuccess(''); 
        setStep(1);
        setUsernameInput('');
        setName('');
        setPassword('');
        setPhone('');
        setOtpValues(['', '', '', '']);
        onClose(); 
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please review details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.55)] border border-slate-200/50 dark:border-slate-800 overflow-hidden transition-all duration-500"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Dynamic Header Banner - MakeMyTrip styling */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-6 px-8 text-white relative shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl" />
          <h1 className="text-lg font-black tracking-widest uppercase text-blue-200">ROAMNEXA</h1>
          <p className="text-xs font-semibold text-white/80 mt-1">Unlock flight cashbacks, smart AI itineraries &amp; zero-fee bookings</p>
        </div>

        <div className="p-8">
          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl px-4 py-3 mb-5 text-sm font-bold animate-pulse">
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

          {step === 1 ? (
            /* ================= SCREEN 1: LOGIN/SIGNUP SELECTION ================= */
            <div>
              {/* Personal / MyBiz Segmented Controls */}
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1 mb-8">
                <button 
                  onClick={() => setAccountType('personal')}
                  className={`py-3.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    accountType === 'personal' 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${accountType === 'personal' ? 'bg-blue-600 dark:bg-emerald-400' : 'bg-slate-400'}`} />
                  PERSONAL ACCOUNT
                </button>
                <button 
                  onClick={() => setAccountType('mybiz')}
                  className={`py-3.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 relative ${
                    accountType === 'mybiz' 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <Briefcase size={14} />
                  MYBIZ ACCOUNT
                  <span className="absolute -top-2.5 -right-1 bg-orange-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90 animate-bounce">Save GST</span>
                </button>
              </div>

              {/* Title Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Login or Create Account</h2>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">Enter credentials to proceed</p>
              </div>

              <form onSubmit={handleContinue} className="space-y-6">
                {/* Input block - MMT Signature styling */}
                <div className="relative border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-850/30 transition-colors">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mobile Number / Email ID</span>
                  <div className="flex items-center gap-2">
                    {/* Country Code simulation for MMT mobile entry */}
                    {!usernameInput.includes('@') && (
                      <span className="text-sm font-extrabold text-slate-500 select-none">🇮🇳 +91 -</span>
                    )}
                    <input 
                      type="text"
                      value={usernameInput}
                      onChange={e => setUsernameInput(e.target.value)}
                      placeholder="Enter mobile number or email"
                      className="w-full bg-transparent text-sm font-extrabold text-slate-800 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500 cursor-text"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-101 hover:shadow-blue-500/10 transition-all cursor-pointer text-sm tracking-wider uppercase"
                >
                  Continue
                </button>
              </form>

              {/* Alternative Social Logins */}
              <div className="mt-8 text-center">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                  <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or login with</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                </div>

                <button 
                  onClick={() => { setUsernameInput('guest_demo@roamnexa.com'); setStep(2); }}
                  className="mt-5 w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <img src="https://images.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google logo" className="w-5 h-5 object-contain" />
                  Continue with Google Demo
                </button>
              </div>
            </div>
          ) : (
            /* ================= SCREEN 2: DETAILS & OTP CODE ENTRY ================= */
            <div>
              {/* Back button */}
              <button 
                onClick={() => { setStep(1); setError(''); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Go Back</span>
              </button>

              {/* MMT Active Account identifier header */}
              <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Username</div>
                  <div className="text-sm font-extrabold text-slate-800 dark:text-white truncate max-w-[220px]">{usernameInput}</div>
                </div>
                <button 
                  onClick={() => { setStep(1); setError(''); }}
                  className="text-xs font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Change
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Simulated signup credentials if they enter non-guest fields */}
                {usernameInput !== 'guest_demo@roamnexa.com' && !name && (
                  <div className="relative border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-850/30">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Full Name (Sign Up only)</span>
                    <input 
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-transparent text-sm font-extrabold text-slate-800 dark:text-white outline-none cursor-text"
                    />
                  </div>
                )}

                {otpMode ? (
                  /* --- 4-Digit MMT OTP Grid --- */
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3 tracking-wider">Enter 4-Digit OTP Code</label>
                    <div className="flex gap-4 justify-between mb-4">
                      {otpValues.map((digit, i) => (
                        <input 
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(e.target.value, i)}
                          onKeyDown={e => handleKeyDown(e, i)}
                          placeholder="•"
                          className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-xl text-center rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold mt-2">
                      <span className="text-slate-400">
                        {otpTimer > 0 ? `Resend OTP in 00:${otpTimer < 10 ? '0' : ''}${otpTimer}` : 'Didn\'t receive OTP?'}
                      </span>
                      {otpTimer === 0 && (
                        <button 
                          type="button" 
                          onClick={() => setOtpTimer(30)}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* --- Classic password login box --- */
                  <div className="relative border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-850/30">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Enter Security Password</span>
                    <div className="relative">
                      <input 
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm font-extrabold text-slate-800 dark:text-white outline-none pr-8 cursor-text"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-101 transition-all cursor-pointer text-sm uppercase tracking-wider"
                >
                  {loading ? 'Verifying Credentials...' : 'Verify & Log In'}
                </button>

                <div className="text-center mt-5">
                  <button 
                    type="button"
                    onClick={() => { setOtpMode(!otpMode); setError(''); }}
                    className="text-xs font-black text-blue-600 hover:text-blue-700 cursor-pointer uppercase tracking-wider"
                  >
                    {otpMode ? 'Login With Password instead' : 'Login With One-Time OTP instead'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
