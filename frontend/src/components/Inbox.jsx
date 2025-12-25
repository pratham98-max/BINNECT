import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, User } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';

const Inbox = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const { data } = await api.get('/enquiries/my-inbox', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnquiries(data);
      } catch (err) {
        console.error("Inbox load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
        <Mail className="text-blue-500" /> Incoming Proposals
      </h2>

      {loading ? (
        <div className="text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Scanning Inbox...</div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={enq._id}
              className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Business</p>
                    <p className="text-sm font-bold">{enq.providerId?.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase">
                  <Clock size={12} /> {new Date(enq.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-300 leading-relaxed italic">"{enq.message}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[40px]">
          <MessageSquare className="mx-auto mb-4 text-gray-800" size={48} />
          <p className="text-gray-500 font-medium">No proposals received yet.</p>
        </div>
      )}
    </section>
  );
};

export default Inbox;