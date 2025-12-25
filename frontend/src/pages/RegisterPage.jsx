import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '', category: '', targetCustomer: '', desiredService: '', website: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser?.getIdToken(true);
      await api.post('/providers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Niche Deployed!");
      navigate('/explore');
    } catch (err) {
      alert("Registration failed. Please fill all fields.");
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-12 pt-32 max-w-5xl mx-auto">
        <h1 className="text-7xl font-black italic uppercase mb-12">Register <span className="text-blue-600">Niche</span></h1>
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 p-10 rounded-[45px] space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input required placeholder="Business Name" className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none" onChange={e => setFormData({...formData, businessName: e.target.value})} />
            <input required placeholder="Category" className="bg-black/40 border border-white/10 p-5 rounded-2xl outline-none" onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <textarea required placeholder="Target Customer" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl h-32 outline-none" onChange={e => setFormData({...formData, targetCustomer: e.target.value})} />
          <input required placeholder="Core Solution (Desired Service)" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none" onChange={e => setFormData({...formData, desiredService: e.target.value})} />
          <input placeholder="Website URL (https://...)" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none" onChange={e => setFormData({...formData, website: e.target.value})} />
          <button type="submit" className="w-full py-6 bg-blue-600 font-black rounded-3xl uppercase tracking-widest hover:bg-blue-700 transition-all">Deploy Niche</button>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;