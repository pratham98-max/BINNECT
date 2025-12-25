import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '', 
    category: '', 
    targetCustomer: '', 
    desiredService: '', 
    website: ''
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Create a temporary local URL for the image preview
      setPreview(URL.createObjectURL(selected)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a brand image/logo first.");
      return;
    }

    try {
      // 1. Get Authentication Token
      const token = await auth.currentUser?.getIdToken(true);
      
      // 2. Prepare Multipart Form Data
      const data = new FormData();
      // 'logo' must match the backend upload.single('logo')
      data.append('logo', file); 
      data.append('businessName', formData.businessName);
      data.append('category', formData.category);
      data.append('targetCustomer', formData.targetCustomer);
      data.append('desiredService', formData.desiredService);
      data.append('website', formData.website);

      // 3. Send Request
      await api.post('/providers', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          // Browser automatically sets boundary for multipart/form-data
          'Content-Type': 'multipart/form-data' 
        }
      });

      alert("Deployment Successful!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Full Registration Error:", err.response?.data || err);
      alert(`Registration Failed: ${err.response?.data?.message || "Check Server Connection"}`);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white flex">
      <Sidebar />
      <main className="flex-1 p-12 pt-32 max-w-5xl mx-auto">
        <h1 className="text-7xl font-black italic uppercase mb-12">
          Deploy <span className="text-blue-600">Niche</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 p-10 rounded-[45px] space-y-8">
          
          {/* IMAGE UPLOAD ZONE */}
          <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[40px] p-12 bg-black/20 hover:border-blue-500/50 transition-all cursor-pointer">
            {preview ? (
              <div className="w-full h-64 relative">
                <img src={preview} className="w-full h-full object-cover rounded-3xl shadow-2xl" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => {setFile(null); setPreview(null);}} 
                  className="absolute -top-4 -right-4 bg-red-600 p-3 rounded-full shadow-xl hover:bg-red-700 transition-colors"
                >
                  <X size={20}/>
                </button>
                <div className="absolute bottom-4 left-4 bg-blue-600 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle size={14}/> Image Staged
                </div>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center cursor-pointer py-10">
                <Upload size={48} className="text-blue-500 mb-4 animate-bounce" />
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Select Brand Asset</p>
                <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase">JPG, PNG OR WEBP (MAX 5MB)</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
              </label>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Business Name</label>
              <input required value={formData.businessName} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, businessName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
              <input required value={formData.category} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Target Customer</label>
            <textarea required value={formData.targetCustomer} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl h-32 outline-none focus:border-blue-500 resize-none" onChange={e => setFormData({...formData, targetCustomer: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Core Solution</label>
            <input required value={formData.desiredService} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, desiredService: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Official Website</label>
            <input value={formData.website} className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-500" onChange={e => setFormData({...formData, website: e.target.value})} />
          </div>
          
          <button type="submit" className="w-full py-8 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
            Authorize Deployment
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;