import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Included Link import
import { motion } from 'framer-motion';
import { Globe, Target, Zap, ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';
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
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black animate-pulse uppercase tracking-widest text-blue-500">Decoding Niche...</div>;
  if (!biz) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold uppercase tracking-tighter">Profile Not Found</div>;

  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-16 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-12 font-bold uppercase text-xs tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
        </Link>

        <div className="max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 bg-blue-600/20 rounded-[40px] border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/20">
              <Zap size={48} />
            </div>

            <div className="flex-1">
              <h1 className="text-6xl font-bold tracking-tighter mb-4">{biz.businessName}</h1>
              <div className="flex gap-4 mb-8">
                <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">{biz.category}</span>
                <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-green-400 text-[10px] font-black uppercase tracking-widest">Verified Niche</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[35px] hover:border-blue-500/30 transition-all">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2"><Target size={12}/> Target Audience</p>
                  <p className="text-xl font-medium italic text-gray-200">"{biz.targetCustomer}"</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[35px] hover:border-purple-500/30 transition-all">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2"><Zap size={12}/> Core Solution</p>
                  <p className="text-xl font-medium italic text-gray-200">"{biz.desiredService}"</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href={biz.website} target="_blank" className="px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                  Visit Website <ExternalLink size={16} />
                </a>

                {/* UPDATED: ACTIVATE ENQUIRY LINK */}
                <Link 
                  to={`/enquiry/${id}`} 
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 text-center"
                >
                  <Mail size={16}/> Send Inquiry
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;