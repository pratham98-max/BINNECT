import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const ExplorePage = () => {
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const { data } = await api.get('/providers');
        setNiches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNiches();
  }, []);

  const filtered = niches.filter(n => 
    n.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    n.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-16 pt-32 max-w-7xl mx-auto">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-12">Discovery</h1>
        
        <div className="relative max-w-xl mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search niches..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-8 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[40px]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((n) => (
              <Link 
                to={`/profile/${n._id}`} // CRITICAL: Use ._id from MongoDB
                key={n._id} 
                className="group bg-white/[0.03] border border-white/10 p-10 rounded-[50px] hover:bg-white/[0.06] transition-all"
              >
                <div className="flex justify-between mb-8">
                  <Zap className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{n.category}</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-blue-400">{n.businessName}</h3>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">View Profile</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;