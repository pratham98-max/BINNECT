import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Bookmark, Search, MessageSquare, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Register Niche', path: '/register' },
    { icon: <Bookmark size={20} />, label: 'Saved Niches', path: '/saved' },
    { icon: <Search size={20} />, label: 'Explore', path: '/explore' },
    // NEW: Added Enquiries section
    { icon: <MessageSquare size={20} />, label: 'Enquiries', path: '/messages' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-[#050505] border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/20">B</div>
        <span className="text-xl font-bold tracking-tighter text-white hidden lg:block uppercase italic">Binnect</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group ${
              location.pathname === item.path 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className="font-bold text-sm hidden lg:block uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={() => auth.signOut()}
        className="flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 transition-all mt-auto"
      >
        <LogOut size={20} />
        <span className="font-bold text-sm hidden lg:block uppercase tracking-widest">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;