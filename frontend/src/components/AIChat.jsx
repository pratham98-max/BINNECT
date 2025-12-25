import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';
import api from '../services/api';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Welcome to Binnect! I am Gemini. How can I help you scale today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // POST request to your backend AI route
      const { data } = await api.post('/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my brain. Please check your internet or API setup." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all border-4 border-white/10"
        >
          <Bot size={28} />
        </button>
      ) : (
        <div className="w-96 h-[550px] bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 bg-blue-600 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><Bot size={18} /></div>
              <span className="font-black uppercase text-[10px] tracking-[0.2em] text-white">Gemini Intelligence</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} className="text-white/80" /></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-3xl max-w-[85%] text-[13px] font-medium leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-blue-500 animate-pulse text-[9px] font-black uppercase tracking-widest ml-2">Processing Data...</div>}
          </div>

          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about niches or scaling..."
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs outline-none focus:border-blue-500 text-white transition-all"
            />
            <button onClick={sendMessage} className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;