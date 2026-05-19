import React, { useState } from 'react';
import { X, Wallet, RefreshCw, ArrowUpRight, DollarSign, CheckCircle, CreditCard, ChevronRight, ArrowDownLeft } from 'lucide-react';

const PayoneerWalletModal = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [payoneerEmail, setPayoneerEmail] = useState('');
  const [payoneerPassword, setPayoneerPassword] = useState('');
  
  // Wallet state balances
  const [balances, setBalances] = useState({
    USD: 1450.00,
    EUR: 820.00,
    GBP: 410.00,
    INR: 120500.00
  });

  // Transfer Funds simulation states
  const [transferAmount, setTransferAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [exchanging, setExchanging] = useState(false);

  // Transactions ledger log
  const [transactions, setTransactions] = useState([
    { id: 'TX-9018', title: 'Air India Flight ticket BOM to DXB', amount: '-$340.00', date: '2026-05-18', type: 'debit', status: 'Completed' },
    { id: 'TX-8831', title: 'Voygo Booking cashback rewards', amount: '+$45.00', date: '2026-05-16', type: 'credit', status: 'Completed' },
    { id: 'TX-8291', title: 'Payoneer Balance Auto-Sync deposit', amount: '+$800.00', date: '2026-05-14', type: 'credit', status: 'Completed' }
  ]);

  if (!isOpen) return null;

  // Static conversion rates (to INR)
  const rates = {
    USD: 83.5,
    EUR: 90.2,
    GBP: 105.8,
    INR: 1.0
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (!payoneerEmail || !payoneerPassword) {
      alert('Please fill out your Payoneer email and password');
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1800);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid transfer amount');
      return;
    }

    if (balances[fromCurrency] < amount) {
      alert(`Insufficient funds! Your ${fromCurrency} balance is ${balances[fromCurrency]}`);
      return;
    }

    setExchanging(true);
    setTimeout(() => {
      // Calculate conversion
      const rateFromInr = rates[fromCurrency];
      const rateToInr = rates[toCurrency];
      const convertedValue = (amount * rateFromInr) / rateToInr;

      setBalances(prev => ({
        ...prev,
        [fromCurrency]: Number((prev[fromCurrency] - amount).toFixed(2)),
        [toCurrency]: Number((prev[toCurrency] + convertedValue).toFixed(2))
      }));

      // Add to transaction ledger
      setTransactions(prev => [
        {
          id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `Payoneer Swap ${fromCurrency} ➔ ${toCurrency}`,
          amount: `${fromCurrency === 'USD' || fromCurrency === 'EUR' || fromCurrency === 'GBP' ? '-' : ''}${fromCurrency === 'USD' ? '$' : fromCurrency === 'EUR' ? '€' : fromCurrency === 'GBP' ? '£' : '₹'}${amount.toFixed(2)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'swap',
          status: 'Completed'
        },
        ...prev
      ]);

      setTransferAmount('');
      setExchanging(false);
      alert(`Payoneer Swap Successful! Swapped ${amount} ${fromCurrency} to ${convertedValue.toFixed(2)} ${toCurrency}`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-white/40 dark:border-slate-800 p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wallet size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wide">Multi-Currency Wallet</h2>
              <span className="text-[10px] font-black uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/40 px-2 py-0.5 rounded">Payoneer Wallet Sync</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Pay globally in multiple local currencies, swap funds with active rates, and track spend abroad</p>
          </div>
        </div>

        {!isConnected ? (
          /* Connecting flow container */
          <div className="py-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-800/30 text-amber-600 dark:text-amber-400 animate-pulse">
              <Wallet size={30} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Connect your Payoneer Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Link your Payoneer digital account to seamlessly fund your travel wallet, exchange multi-currency balances, and check out with zero transaction fees.
            </p>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Payoneer Email Address</label>
                <input 
                  type="email"
                  value={payoneerEmail}
                  onChange={e => setPayoneerEmail(e.target.value)}
                  placeholder="name@payoneer.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Account Password / PIN</label>
                <input 
                  type="password"
                  value={payoneerPassword}
                  onChange={e => setPayoneerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl outline-none font-bold placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isConnecting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-101 transition-all cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Syncing Payoneer Assets...
                  </>
                ) : (
                  <>
                    Connect Payoneer Wallet
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Wallet Dashboard View */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 rounded-3xl p-5 gap-4">
              <div className="flex gap-3 items-center">
                <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <div className="font-extrabold text-sm text-slate-800 dark:text-white">Payoneer Wallet Linked Successfully</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">Payoneer Sync Account ID: PAY-884-JKA2</div>
                </div>
              </div>
              <button 
                onClick={() => { setIsConnected(false); setPayoneerEmail(''); setPayoneerPassword(''); }}
                className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer self-start sm:self-center"
              >
                Disconnect Wallet
              </button>
            </div>

            {/* Currency Card Grid */}
            <div>
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Foreign Exchange Balances</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="text-[10px] font-black text-slate-400 uppercase">US Dollar</div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1.5">${balances.USD.toLocaleString()}</div>
                  <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">US</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="text-[10px] font-black text-slate-400 uppercase">Euro</div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1.5">€{balances.EUR.toLocaleString()}</div>
                  <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">EU</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="text-[10px] font-black text-slate-400 uppercase">British Pound</div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1.5">£{balances.GBP.toLocaleString()}</div>
                  <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold text-xs">UK</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden">
                  <div className="text-[10px] font-black text-slate-400 uppercase">Indian Rupee</div>
                  <div className="text-xl font-black text-slate-800 dark:text-white mt-1.5">₹{balances.INR.toLocaleString()}</div>
                  <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">IN</div>
                </div>
              </div>
            </div>

            {/* Transfer / Currency Exchange Simulation Widget */}
            <div className="bg-slate-50/50 dark:bg-slate-850/30 border border-slate-150 dark:border-slate-800 rounded-[2rem] p-6">
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5"><CreditCard size={14} /> Payoneer Currency Swap Converter</h4>
              
              <form onSubmit={handleTransfer} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Sell Currency</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Amount"
                      value={transferAmount}
                      onChange={e => setTransferAmount(e.target.value.replace(/[^\d.]/g, ''))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-3.5 py-3 rounded-2xl outline-none font-bold text-sm"
                    />
                    <select 
                      value={fromCurrency} 
                      onChange={e => setFromCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-2 py-3 rounded-2xl font-bold text-sm cursor-pointer"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center py-2 sm:py-0">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 shadow-sm shrink-0">
                    <ChevronRight size={18} className="rotate-90 sm:rotate-0" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Buy Currency</label>
                  <div className="flex gap-2">
                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 px-3.5 py-3 rounded-2xl font-bold text-sm">
                      {transferAmount && !isNaN(parseFloat(transferAmount)) 
                        ? Number(((parseFloat(transferAmount) * rates[fromCurrency]) / rates[toCurrency]).toFixed(2)).toLocaleString()
                        : '0.00'
                      }
                    </div>
                    <select 
                      value={toCurrency} 
                      onChange={e => setToCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-2 py-3 rounded-2xl font-bold text-sm cursor-pointer"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3 mt-2">
                  <button 
                    type="submit"
                    disabled={exchanging}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer hover:scale-101 disabled:opacity-50"
                  >
                    {exchanging ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Executing Payoneer Swap...
                      </>
                    ) : (
                      <>
                        Confirm Transfer Swap
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions history log */}
            <div>
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Recent Wallet Transactions</h4>
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div 
                    key={tx.id}
                    className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'debit' 
                          ? 'bg-red-500/10 text-red-500' 
                          : tx.type === 'credit'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {tx.type === 'debit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[250px] sm:max-w-md">{tx.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{tx.id} • {tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-black text-sm ${tx.type === 'debit' ? 'text-red-500' : 'text-emerald-500'}`}>{tx.amount}</div>
                      <div className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoneerWalletModal;
