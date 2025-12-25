import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Zap, ArrowLeft, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const { id } = useParams();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/providers/${id}`);
        setBiz(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black animate-pulse text-blue-500 uppercase tracking-widest">Decoding Niche...</div>;
  if (!biz) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black uppercase">Profile Not Found</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden">
      <Sidebar />
      
      {/* HERO GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-blue-600/10 blur-[160px] -z-10" />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-16 uppercase text-[10px] font-black tracking-[0.3em] transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Discovery
        </Link>

        {/* CENTERED HEADER */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-44 h-44 bg-blue-600/10 rounded-[55px] border border-blue-500/20 flex items-center justify-center text-blue-500 mb-10 shadow-3xl shadow-blue-500/20">
            <Zap size={72} />
          </motion.div>
          
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase leading-none">{biz.businessName}</h1>
          
          <div className="flex gap-4">
            <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{biz.category}</span>
            <span className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} /> Verified Niche
            </span>
          </div>
        </div>

        {/* BALANCED GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/10 p-12 rounded-[50px] backdrop-blur-3xl hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <Target size={18} className="text-gray-500" />
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Target Audience</p>
            </div>
            <p className="text-2xl font-medium italic text-gray-200 leading-relaxed">"{biz.targetCustomer}"</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/10 p-12 rounded-[50px] backdrop-blur-3xl hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <Zap size={18} className="text-gray-500" />
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Core Solution</p>
            </div>
            <p className="text-2xl font-medium italic text-gray-200 leading-relaxed">"{biz.desiredService}"</p>
          </motion.div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a href={biz.website} target="_blank" rel="noopener noreferrer" className="px-14 py-7 bg-white text-black font-black rounded-[28px] flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-xs">
            Launch Website <ExternalLink size={18} />
          </a>
          <Link to={`/enquiry/${id}`} className="px-14 py-7 bg-white/5 border border-white/10 rounded-[28px] font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95">
            <Mail size={18} /> Direct Inquiry
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;