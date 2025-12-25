import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Briefcase, Users, TrendingUp, ExternalLink, Edit3 } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';
// 1. Added Inbox import
import Inbox from '../components/Inbox'; 

const Dashboard = () => {
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const { data } = await api.get('/providers/my-businesses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyBusinesses(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchStats();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex bg-[#050505] min-h-screen text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Workspace</h1>
            <p className="text-gray-500 font-medium">Manage your niche and track partnership growth.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard 
            icon={<Briefcase className="text-blue-400" />} 
            label="Total Businesses" 
            value={myBusinesses.length} 
            color="bg-blue-600"
          />
          <MetricCard 
            icon={<Users className="text-purple-400" />} 
            label="Active Leads" 
            value="12" 
            color="bg-purple-600"
          />
          <MetricCard 
            icon={<TrendingUp className="text-green-400" />} 
            label="Visibility Score" 
            value="94%" 
            color="bg-green-600"
          />
        </div>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold tracking-tight">Your Registered Niches</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition">
              <Plus size={16} /> New Business
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Workspace...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {myBusinesses.map((biz, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={biz._id}
                  className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-full md:w-32 h-32 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <LayoutDashboard size={40} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{biz.businessName}</h3>
                      <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400">
                        <Edit3 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-blue-500 font-black uppercase tracking-widest mb-4">{biz.category}</p>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-6">Looking for: {biz.desiredService}</p>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 bg-white text-black text-xs font-black rounded-xl uppercase hover:bg-blue-600 hover:text-white transition-all">Manage</button>
                      <a href={biz.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-gray-400">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 2. ADDED INBOX SECTION */}
        {/* This will render all proposals sent to your businesses below the business list */}
        <Inbox />
      </main>
    </div>
  );
};

const MetricCard = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[35px] relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 blur-[40px] rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
      {icon}
    </div>
    <div className="text-4xl font-bold tracking-tighter mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</div>
  </motion.div>
);

export default Dashboard;