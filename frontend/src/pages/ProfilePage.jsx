import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Zap, ArrowLeft, Mail, ExternalLink, ShieldCheck, Star, Users } from 'lucide-react';
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
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProfile();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Get fresh token from Firebase
      const token = await auth.currentUser?.getIdToken(true);
      
      // 2. Post review with headers
      const { data } = await api.post(`/providers/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReviews(data);
      setNewReview({ rating: 5, comment: '' });
      alert("Review successfully posted!");
    } catch (err) {
      console.error("Post Error:", err.response?.data);
      alert("Failed to post: " + (err.response?.data?.message || "Check connection"));
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.3em]">Decoding Profile...</div>;
  if (!biz) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Profile Not Found</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white relative">
      <Sidebar />
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-16 uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={14} /> Back to Discovery
        </Link>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="w-44 h-44 bg-blue-600/10 rounded-[55px] border border-blue-500/20 flex items-center justify-center text-blue-500 mb-10">
            <Zap size={72} />
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase leading-none">{biz.businessName}</h1>
          <div className="flex gap-4">
            <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">{biz.category}</span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[50px]">
            <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Target Audience</p>
            <p className="text-2xl font-medium italic text-gray-200 leading-relaxed">"{biz.targetCustomer}"</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[50px]">
            <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Core Solution</p>
            <p className="text-2xl font-medium italic text-gray-200 leading-relaxed">"{biz.desiredService}"</p>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mb-20 border-t border-white/5 pt-20">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-12">Verified Reviews</h3>
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Form */}
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] h-fit">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-blue-400">Rate Service</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={24} fill={newReview.rating >= s ? "#eab308" : "none"} className={`cursor-pointer ${newReview.rating >= s ? 'text-yellow-500' : 'text-gray-600'}`} onClick={() => setNewReview({...newReview, rating: s})} />
                  ))}
                </div>
                <textarea required value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Experience..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none min-h-[120px]" />
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-blue-700">Submit Review</button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[35px]">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-sm uppercase text-gray-200">{r.userName}</span>
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(r.rating)].map((_, star) => <Star key={star} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-gray-400 italic text-sm">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center gap-6">
          <a href={biz.website} target="_blank" className="px-14 py-7 bg-white text-black font-black rounded-[28px] uppercase tracking-widest text-xs">Visit Hub</a>
          <Link to={`/enquiry/${id}`} className="px-14 py-7 bg-white/5 border border-white/10 rounded-[28px] font-black uppercase text-xs tracking-widest">Inquiry</Link>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;