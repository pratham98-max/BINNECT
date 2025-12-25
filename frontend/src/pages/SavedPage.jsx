import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { auth } from '../services/firebase';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const SavedPage = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async (user) => {
      try {
        const token = await user.getIdToken(true);
        const { data } = await api.get('/providers/saved', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSaved(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load saved businesses", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchSaved(user);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRemove = async (bizId) => {
    if (!window.confirm("Remove this business from your saved niche?")) return;
    try {
      const token = await auth.currentUser?.getIdToken(true);
      await api.delete(`/providers/saved/${bizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaved(prev => prev.filter(biz => biz._id !== bizId));
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Sidebar />

      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-12 relative">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full -z-10" />

        <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold mb-4 tracking-widest uppercase">
              <Bookmark size={12} /> Your Collection
            </div>
            <h1 className="text-5xl font-bold tracking-tighter mb-2">Saved Niche</h1>
            <p className="text-gray-500 font-medium">Your curated list of high-potential business partners.</p>
          </motion.div>

          <Link to="/explore" className="group flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Back to Explore</span>
          </Link>
        </header>

        <section className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-40 text-center animate-pulse text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Bookmarks...</div>
          ) : saved.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {saved.map((biz, idx) => (
                  <motion.div
                    key={biz._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 group relative hover:border-purple-500/30 transition-all shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />

                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="w-14 h-14 bg-purple-600/10 rounded-[22px] flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-xl">
                        <Sparkles size={28} />
                      </div>
                      <button 
                        onClick={() => handleRemove(biz._id)}
                        className="bg-white/5 hover:bg-red-500/20 border border-white/10 p-4 rounded-full text-gray-500 hover:text-red-400 transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <h3 className="text-3xl font-bold mb-2 tracking-tight group-hover:text-purple-400 transition-colors">{biz.businessName}</h3>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-[10px] font-black uppercase bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 tracking-widest">
                        {biz.category}
                      </span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl mb-10 relative z-10">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Ideal Target</p>
                      <p className="text-lg italic text-gray-200 leading-tight">"{biz.targetCustomer}"</p>
                    </div>

                    <div className="flex gap-4 relative z-10">
                      {/* UPDATED: VIEW PROFILE LINK */}
                      <Link 
                        to={`/profile/${biz._id}`} 
                        className="flex-[3] py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest text-center"
                      >
                        View Profile
                      </Link>
                      
                      <a 
                        href={biz.website?.startsWith('http') ? biz.website : `https://${biz.website}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                      >
                        <ExternalLink size={20} className="text-gray-400" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-white/[0.02] border border-dashed border-white/10 rounded-[60px]">
              <Bookmark className="mx-auto mb-6 text-gray-700" size={64} />
              <p className="text-3xl font-bold text-gray-400 tracking-tighter mb-8">Your saved list is empty.</p>
              <Link to="/explore" className="bg-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all inline-block">
                Start Exploring
              </Link>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SavedPage;