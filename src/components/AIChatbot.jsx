import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, ArrowRight, User } from 'lucide-react';
import axios from 'axios';

// Simple lightweight Markdown formatter to handle formatting gracefully without dependencies
const formatMessageText = (text) => {
  if (!text) return '';
  
  // Split into lines
  const lines = text.split('\n');
  const formattedElements = [];
  let inList = false;
  let inTable = false;
  let tableHeaders = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Handle Headings
    if (line.startsWith('### ')) {
      formattedElements.push(<h4 key={i} className="text-base font-bold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h4>);
      continue;
    }
    if (line.startsWith('#### ')) {
      formattedElements.push(<h5 key={i} className="text-sm font-bold text-slate-700 mt-2 mb-1">{line.replace('#### ', '')}</h5>);
      continue;
    }
    if (line.startsWith('## ')) {
      formattedElements.push(<h3 key={i} className="text-lg font-extrabold text-slate-900 mt-4 mb-2">{line.replace('## ', '')}</h3>);
      continue;
    }

    // Handle Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) {
        // Skip separator lines
        continue;
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        continue;
      } else {
        formattedElements.push(
          <div key={i} className="grid grid-cols-4 gap-2 bg-slate-50 p-2 border-b border-slate-100 text-xs text-slate-700 my-1">
            {cells.map((cell, cIdx) => (
              <div key={cIdx} className={cIdx === 0 ? 'font-bold' : ''}>{parseInlineMarkdown(cell)}</div>
            ))}
          </div>
        );
        continue;
      }
    } else if (inTable) {
      inTable = false;
    }

    // Handle Bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const cleanText = line.substring(2);
      formattedElements.push(
        <div key={i} className="flex gap-2 items-start my-1 text-sm text-slate-600 pl-2">
          <span className="text-blue-500">•</span>
          <span>{parseInlineMarkdown(cleanText)}</span>
        </div>
      );
      continue;
    }

    // Default Paragraph line
    if (line === '') {
      formattedElements.push(<div key={i} className="h-2"></div>);
    } else {
      formattedElements.push(<p key={i} className="text-sm text-slate-600 leading-relaxed my-1">{parseInlineMarkdown(line)}</p>);
    }
  }

  return <div>{formattedElements}</div>;
};

// Parse bold **text** in a string
const parseInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Hi! I am Roamnexa's Smart Travel Agent. I can plan complete day-by-day itineraries, suggest flight/hotel concepts, or recommend beautiful sights. Where are you dreaming of traveling?",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Listen to the AI planner event from the search tab
  useEffect(() => {
    const handleOpenChat = (event) => {
      const promptText = event.detail?.prompt || '';
      setIsOpen(true);
      if (promptText) {
        handleSendMessage(promptText);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-ai-chat', handleOpenChat);
    };
  }, []);

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const res = await axios.post('/api/ai/chat', {
        message: messageText,
        history: history,
      });

      const botMessage = {
        id: Date.now().toString() + '-bot',
        role: 'model',
        text: res.data.response,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('AI chat failed:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-err',
          role: 'model',
          text: "⚠️ Sorry, I'm having trouble connecting to my brain right now. Make sure the backend server is running on http://localhost:5000."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const starterChips = [
    "Plan 3 days in Bali",
    "Goa beach weekend plan",
    "Itinerary for Paris trip",
    "Must try foods in Tokyo"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${!isOpen ? 'animate-float' : ''}`}
      >
        {isOpen ? <X size={24} /> : <Sparkles className="animate-spin-slow" size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[380px] sm:w-[420px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Roamnexa AI Travel Agent</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
                  <span className="text-[10px] text-green-300 font-medium uppercase tracking-wider">Ready to plan</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => {
              const isBot = msg.role === 'model';
              return (
                <div key={msg.id} className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                      <Sparkles size={14} className="text-purple-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm border ${
                      isBot
                        ? 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                        : 'bg-blue-600 text-white border-blue-500 rounded-tr-none'
                    }`}
                  >
                    {isBot ? formatMessageText(msg.text) : <p className="text-sm">{msg.text}</p>}
                  </div>
                  {!isBot && (
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                      <User size={14} className="text-blue-600" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Suggestion Chips (only show when no user messages exist or just a few) */}
            {messages.length === 1 && (
              <div className="pt-2 pl-11">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {starterChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100 animate-pulse">
                  <Sparkles size={14} className="text-purple-600" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your trip..."
              className="flex-1 max-h-16 resize-none outline-none border border-slate-200 focus:border-blue-400 bg-slate-50 focus:bg-white rounded-xl py-2 px-3 text-sm text-slate-700 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-slate-300 hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue-500/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
