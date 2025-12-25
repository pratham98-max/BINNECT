import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, ShieldCheck, Star, ExternalLink, Mail, Users } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const { id } = useParams();
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/providers/${id}`);
        setBiz(data);
        setReviews(data.reviews || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProfile();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const { data } = await api.post(`/providers/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(data);
      setNewReview({ rating: 5, comment: '' });
      alert("Feedback Authenticated!");
    } catch (err) { alert("Deployment Error"); }
  };

  if (loading || !biz) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 font-black italic animate-pulse">DECODING PROFILE...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 max-w-6xl mx-auto p-6 pt-32 pb-32">
        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-black tracking-[0.3em]">
          <ArrowLeft size={14} /> Discovery Hub
        </Link>

        {/* CINEMATIC HERO */}
        <header className="relative w-full h-[500px] rounded-[60px] overflow-hidden mb-20 border border-white/10 group">
          <img src={biz.logoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute bottom-16 left-16 right-16 flex flex-col items-center text-center">
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none">{biz.businessName}</motion.h1>
            <div className="flex gap-4">
               <span className="px-8 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/40">{biz.category}</span>
               <span className="px-8 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> Verified</span>
            </div>
          </div>
        </header>

        {/* CORE DATA */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[50px] hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-widest">Target Audience</p>
            <p className="text-3xl font-medium italic text-gray-200">"{biz.targetCustomer}"</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[50px] hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-widest">Core Solution</p>
            <p className="text-3xl font-medium italic text-gray-200">"{biz.desiredService}"</p>
          </div>
        </div>

        {/* FEEDBACK TERMINAL */}
        <section className="mb-20 border-t border-white/5 pt-20">
          <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Verified <span className="text-blue-600">Feedback</span></h3>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[45px] h-fit">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-blue-400 text-center">Deploy Feedback</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex justify-center gap-2 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} fill={newReview.rating >= s ? "#eab308" : "none"} className={`cursor-pointer ${newReview.rating >= s ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setNewReview({...newReview, rating: s})} />)}
                </div>
                <textarea required value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Experience report..." className="w-full bg-black/40 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-blue-500 h-32" />
                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-[10px] hover:bg-blue-700">Submit to Ledger</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white/[0.01] border border-white/5 p-8 rounded-[40px] flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{r.userName}</p>
                    <p className="text-gray-400 italic font-medium">"{r.comment}"</p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(r.rating)].map((_, s) => <Star key={s} size={10} fill="currentColor" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center gap-6">
          <a href={biz.website} target="_blank" className="px-16 py-8 bg-white text-black font-black rounded-[35px] uppercase text-[11px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">Launch Hub</a>
          <Link to={`/enquiry/${id}`} className="px-16 py-8 bg-white/5 border border-white/10 rounded-[35px] font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
             <Mail size={18}/> Send Inquiry
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;