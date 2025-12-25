import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Bookmark, Search, MessageSquare, LogOut, X, User } from 'lucide-react';
import { auth } from '../services/firebase';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = auth.currentUser;

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Register Niche', path: '/register' },
    { icon: <Bookmark size={20} />, label: 'Saved Niches', path: '/saved' },
    { icon: <Search size={20} />, label: 'Explore', path: '/explore' },
    { icon: <MessageSquare size={20} />, label: 'Enquiries', path: '/messages' },
  ];

  return (
    <>
      {/* FLOATING TRIGGER: Combines Profile Pic and Name */}
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-full hover:border-blue-500/30 transition-all shadow-2xl">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full border-2 border-blue-500/50 p-0.5 hover:scale-110 transition-transform bg-[#050505] overflow-hidden"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600/20 text-blue-400"><User size={20}/></div>
          )}
        </button>
        <div className="hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-white">{user?.displayName?.split(' ')[0] || 'User'}</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Workspace</p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]" />
            <motion.aside initial={{ x: -350 }} animate={{ x: 0 }} exit={{ x: -350 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 h-screen w-80 bg-[#080808] border-r border-white/10 flex flex-col p-10 z-[120]">
              <div className="flex justify-between items-center mb-16">
                <div className="text-2xl font-black italic uppercase tracking-tighter text-white">Binnect</div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <nav className="flex-1 space-y-3">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                    {item.icon} <span className="font-bold text-xs uppercase tracking-[0.2em]">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <button onClick={() => auth.signOut()} className="flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 transition-all border-t border-white/5 pt-10"><LogOut size={20} /> <span className="font-bold text-xs uppercase tracking-widest">Terminate Session</span></button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;