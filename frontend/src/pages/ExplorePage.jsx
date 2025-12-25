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
    const fetchData = async () => {
      try {
        const { data } = await api.get('/providers');
        setNiches(Array.isArray(data) ? data : []);
        
        // Mocking saved IDs - In a real app, fetch these from user profile
        const saved = JSON.parse(localStorage.getItem('savedNiches') || '[]');
        setSavedIds(saved);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const toggleSave = (e, id) => {
    e.preventDefault(); // Prevent navigating to profile when clicking star
    let updatedSaved = [...savedIds];
    if (updatedSaved.includes(id)) {
      updatedSaved = updatedSaved.filter(savedId => savedId !== id);
    } else {
      updatedSaved.push(id);
    }
    setSavedIds(updatedSaved);
    localStorage.setItem('savedNiches', JSON.stringify(updatedSaved));
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
            Discover <span className="text-blue-600">Niches</span>
          </h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" placeholder="Search category or brand..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-medium text-sm"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-72 bg-white/5 rounded-[45px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((n) => (
              <motion.div whileHover={{ y: -10 }} key={n._id} className="group relative">
                {/* STAR BUTTON */}
                <button 
                  onClick={(e) => toggleSave(e, n._id)}
                  className="absolute top-8 right-8 z-20 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Star size={18} fill={savedIds.includes(n._id) ? "#3b82f6" : "none"} className={savedIds.includes(n._id) ? "text-blue-500" : "text-gray-500"} />
                </button>

                <Link to={`/profile/${n._id}`} className="block bg-white/[0.02] border border-white/10 p-10 rounded-[50px] hover:bg-white/[0.05] transition-all relative overflow-hidden">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-3 group-hover:text-blue-400 transition-colors">{n.businessName}</h3>
                  <p className="text-gray-500 text-sm italic line-clamp-2 mb-10 leading-relaxed italic">"{n.targetCustomer}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">{n.category}</span>
                    <ArrowRight size={18} className="text-gray-600 group-hover:translate-x-2 transition-transform group-hover:text-white" />
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