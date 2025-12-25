import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, ChevronDown, Inbox as InboxIcon, Send as SendIcon } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';

const Inbox = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [view, setView] = useState('received'); // 'received' or 'sent'
  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const endpoint = view === 'received' ? '/enquiries/my-inbox' : '/enquiries/my-sent';
      const { data } = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [view]);

  const handleReply = async (enqId) => {
    if (!replyText.trim()) return;
    
    try {
      const token = await auth.currentUser?.getIdToken(true);
      await api.post(`/enquiries/reply/${enqId}`, { text: replyText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyText(''); // Clear input
      fetchData(); // Refresh chat thread
    } catch (err) {
      alert("Failed to send message. Check console.");
      console.error(err);
    }
  };

  return (
    <section className="mt-16 max-w-4xl relative z-30">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="text-blue-500" /> Messaging Hub
        </h2>
        
        {/* Toggle between Inbox and Sent */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setView('received')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'received' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <InboxIcon size={14} /> Received
          </button>
          <button 
            onClick={() => setView('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'sent' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <SendIcon size={14} /> Sent
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-[10px]">Updating Hub...</div>
      ) : enquiries.length === 0 ? (
        <div className="p-12 border border-dashed border-white/10 rounded-[30px] text-center text-gray-500">
          No messages found in your {view} folder.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq._id} className="bg-white/[0.03] border border-white/10 rounded-[30px] overflow-hidden">
              <div 
                onClick={() => setActiveThread(activeThread === enq._id ? null : enq._id)}
                className="p-6 cursor-pointer flex justify-between items-center hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {view === 'received' ? `From: Client` : `To: ${enq.providerId?.businessName}`}
                    </p>
                    <p className="text-sm text-gray-200 line-clamp-1 italic">"{enq.message}"</p>
                  </div>
                </div>
                <ChevronDown className={`text-gray-600 transition-transform ${activeThread === enq._id ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {activeThread === enq._id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black/20 border-t border-white/5">
                    <div className="p-6 space-y-4 max-h-80 overflow-y-auto flex flex-col">
                      {/* Initial Message */}
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] text-sm text-gray-300">
                        {enq.message}
                      </div>
                      
                      {/* Replies */}
                      {enq.replies?.map((rep, i) => (
                        <div key={i} className={`p-3 rounded-2xl max-w-[80%] text-sm ${rep.senderId === auth.currentUser?.uid ? 'bg-blue-600 text-white self-end rounded-tr-none' : 'bg-white/10 text-gray-300 self-start rounded-tl-none'}`}>
                          {rep.text}
                        </div>
                      ))}
                    </div>

                    {/* REPLY INPUT - Fixed for clickability */}
                    <div className="p-4 bg-white/5 flex gap-2 border-t border-white/5">
                      <input 
                        type="text" 
                        placeholder="Type a message..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleReply(enq._id); }}
                      />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReply(enq._id);
                        }} 
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer relative z-50 pointer-events-auto"
                      >
                        <SendIcon size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Inbox;