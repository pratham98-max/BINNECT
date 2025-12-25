import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, ArrowRight, Trash2 } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const SavedPage = () => {
  const [savedNiches, setSavedNiches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const savedIds = JSON.parse(localStorage.getItem('savedNiches') || '[]');
        const { data } = await api.get('/providers');
        const filtered = data.filter(n => savedIds.includes(n._id));
        setSavedNiches(filtered);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchSaved();
  }, []);

  const removeSaved = (id) => {
    const savedIds = JSON.parse(localStorage.getItem('savedNiches') || '[]');
    const updated = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('savedNiches', JSON.stringify(updated));
    setSavedNiches(savedNiches.filter(n => n._id !== id));
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-16 pt-32 max-w-7xl mx-auto w-full">
        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={14} /> Discovery Hub
        </Link>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-16 leading-none">
          Starred <span className="text-blue-600">Niches</span>
        </h1>

        {savedNiches.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[50px] bg-white/[0.01]">
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No Stars Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {savedNiches.map((n) => (
              <div key={n._id} className="group bg-white/[0.02] border border-white/10 p-10 rounded-[50px] relative">
                <button onClick={() => removeSaved(n._id)} className="absolute top-8 right-8 p-3 text-gray-600 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8"><Zap size={24} /></div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 italic">{n.businessName}</h3>
                <p className="text-gray-500 text-sm mb-10 line-clamp-2 italic">"{n.targetCustomer}"</p>
                <Link to={`/profile/${n._id}`} className="flex items-center justify-between pt-6 border-t border-white/5 group-hover:text-blue-500 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest">Analyze Profile</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPage;