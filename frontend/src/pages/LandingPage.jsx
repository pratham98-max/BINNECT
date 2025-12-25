import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// 1. Import Firebase auth tools
import { auth, provider } from '../services/firebase'; 
import { signInWithPopup } from 'firebase/auth';

const LandingPage = () => {
  const navigate = useNavigate();

  // 2. Updated Login Logic
  const handleAuthAction = async () => {
    try {
      // Execute the popup login first
      const result = await signInWithPopup(auth, provider);
      
      // Only navigate once the user is successfully returned from Firebase
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto relative z-10">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center">B</div>
          BINNECT
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition">Platform</a>
          <a href="#" className="hover:text-white transition">Solutions</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>
        
        {/* 3. Sign In Button now triggers handleAuthAction */}
        <button 
          onClick={handleAuthAction}
          className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-white/5"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 uppercase tracking-widest">
              <Zap size={14} /> AI-Powered Niche Discovery
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-8">
              SCALE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic">BUSINESS</span> WITH <br />
              PRECISION.
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
              Experience smarter decision-making and personalized strategies designed to scale your brand efficiently.
            </p>
            
            <div className="flex gap-4">
              {/* 4. Get Started also triggers handleAuthAction */}
              <button 
                onClick={handleAuthAction}
                className="px-8 py-4 bg-blue-600 rounded-xl font-bold flex items-center gap-2 group hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                Get Started <ArrowRight className="group-hover:translate-x-1 transition" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right Column Visuals */}
          <div className="relative h-[600px] hidden lg:block">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-2xl mb-6 shadow-blue-500/50 shadow-2xl" />
              <div className="h-4 w-32 bg-white/20 rounded-full mb-4" />
              <div className="h-4 w-24 bg-white/10 rounded-full mb-12" />
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full" />
                <div className="h-2 w-full bg-white/5 rounded-full" />
                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
              </div>
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                <ArrowRight size={20} />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl"
            >
              <div className="text-3xl font-bold tracking-tighter">10K+</div>
              <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Global Partners</div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;