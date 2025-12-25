import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Plus, Star, Users, MessageSquare, Zap, ArrowRight, TrendingUp, Search } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';
import MessagesPage from './MessagesPage'; 

const Dashboard = () => {
  const [myNiches, setMyNiches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const { data } = await api.get('/providers/my-workspace', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyNiches(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchWorkspace();
  }, []);

  const totalReviews = myNiches.reduce((acc, niche) => acc + (niche.reviews?.length || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <div className="w-20 h-20 border-t-2 border-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white flex selection:bg-blue-500/30">
      <Sidebar />
      
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      <main className="flex-1 p-6 lg:p-12 pt-32 max-w-7xl mx-auto w-full relative z-10">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[1px] bg-blue-600" />
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Operational Status: Active</p>
            </div>
            <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Center</span>
            </h1>
          </div>
          <Link to="/register" className="group px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-500 uppercase text-[11px] tracking-widest shadow-2xl">
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> Deploy Niche
          </Link>
        </motion.div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: 'Total Businesses', val: myNiches.length, icon: <Zap />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Verified Reviews', val: totalReviews, icon: <Star />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'Visibility Score', val: '94%', icon: <TrendingUp />, color: 'text-green-500', bg: 'bg-green-500/10' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="glass-card p-8 rounded-[40px] transition-all"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <p className="text-5xl font-black italic mb-1 tracking-tighter">{stat.val}</p>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* BUSINESS LISTINGS */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-500 flex items-center gap-3">
              <LayoutDashboard size={16} /> Portfolio Management
            </h2>
          </div>
          
          <div className="grid gap-8">
            <AnimatePresence>
              {myNiches.length > 0 ? myNiches.map((niche, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={niche._id} 
                  className="glass-card p-1 group relative overflow-hidden rounded-[50px]"
                >
                  <div className="p-10 flex flex-col lg:flex-row gap-12 bg-[#080808] rounded-[49px] h-full items-center">
                    
                    {/* Brand Meta */}
                    <div className="lg:w-1/3 border-r border-white/5 pr-10">
                      <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full inline-block mb-4">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{niche.category}</p>
                      </div>
                      <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-tight group-hover:text-blue-500 transition-colors">
                        {niche.businessName}
                      </h3>
                      <div className="mt-8 flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users size={14} /> <span className="text-[10px] font-black">{niche.activeUsers?.length || 0} PARTNERS</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Insights (Reviews) */}
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-6">Live Community Feedback</p>
                      {niche.reviews?.length > 0 ? (
                        <div className="relative p-6 bg-white/[0.02] border border-white/5 rounded-[30px] italic text-gray-400">
                          <span className="text-4xl absolute -top-4 -left-2 text-blue-500/20 font-serif">“</span>
                          <p className="text-sm line-clamp-2 leading-relaxed">
                            {niche.reviews[0].comment}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">— {niche.reviews[0].userName}</span>
                            <div className="flex text-yellow-500"><Star size={10} fill="currentColor" /></div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 border border-dashed border-white/10 rounded-[30px] text-center">
                           <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest">Awaiting First Insight</p>
                        </div>
                      )}
                    </div>

                    {/* Command Button */}
                    <Link to={`/profile/${niche._id}`} className="w-16 h-16 bg-white/5 rounded-[25px] flex items-center justify-center hover:bg-blue-600 transition-all group/btn">
                      <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[60px]">
                  <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-xs">Portfolio Empty</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default Dashboard;