import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const EnquiryPage = () => {
  const { id } = useParams(); // ID of the business being contacted
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBiz = async () => {
      const { data } = await api.get(`/providers/${id}`);
      setBiz(data);
    };
    fetchBiz();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken(true);
      await api.post(`/enquiries/${id}`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🚀 Message sent to " + biz.businessName);
      navigate(`/profile/${id}`);
    } catch (err) {
      alert("Failed to send enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-16 relative flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl"
        >
          <Link to={`/profile/${id}`} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Back to Profile
          </Link>

          <h2 className="text-4xl font-bold tracking-tighter mb-2">Send Enquiry</h2>
          <p className="text-gray-400 mb-10">You are contacting <span className="text-blue-400 font-bold">{biz?.businessName}</span></p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} /> Your Message
              </label>
              <textarea 
                required
                rows="6"
                placeholder="Describe your proposal or question..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-8">
              <ShieldCheck size={20} className="text-blue-400" />
              <p className="text-[10px] text-blue-300 font-medium">Your contact details will be shared with the business owner safely.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {loading ? "Transmitting..." : "Send Proposal"}
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EnquiryPage;