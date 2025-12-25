import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Zap, ArrowRight, Star } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const ExplorePage = () => {
  const [niches, setNiches] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const { data } = await api.get('/providers');
        setNiches(Array.isArray(data) ? data : []);
        const saved = JSON.parse(localStorage.getItem('savedNiches') || '[]');
        setSavedIds(saved);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchNiches();
  }, []);

  const toggleSave = (e, id) => {
    e.preventDefault();
    let updated = savedIds.includes(id) ? savedIds.filter(i => i !== id) : [...savedIds, id];
    setSavedIds(updated);
    localStorage.setItem('savedNiches', JSON.stringify(updated));
  };

  const filtered = niches.filter(n => 
    n.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    n.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-16 pt-32 max-w-7xl mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-8xl font-black tracking-tighter italic uppercase mb-6 leading-none">
            Discovery <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Hub</span>
          </h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" placeholder="Search categories or brands..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-medium text-sm"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-white/5 rounded-[50px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((n) => (
              <motion.div whileHover={{ y: -10 }} key={n._id} className="group relative">
                <button onClick={(e) => toggleSave(e, n._id)} className="absolute top-6 right-6 z-20 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                  <Star size={18} fill={savedIds.includes(n._id) ? "#3b82f6" : "none"} className={savedIds.includes(n._id) ? "text-blue-500" : "text-gray-400"} />
                </button>

                <Link to={`/profile/${n._id}`} className="block bg-white/[0.02] border border-white/10 rounded-[55px] overflow-hidden hover:bg-white/[0.05] transition-all relative">
                  <div className="h-60 w-full overflow-hidden relative">
                    <img src={n.logoUrl} alt={n.businessName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
                  </div>
                  
                  <div className="p-10 -mt-12 relative z-10">
                    <span className="px-4 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                      {n.category}
                    </span>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-blue-500 transition-colors leading-none">
                      {n.businessName}
                    </h3>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Analyze Blueprint</p>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-blue-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;