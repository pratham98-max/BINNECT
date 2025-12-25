import React from 'react';
import Sidebar from '../components/Sidebar';
import Inbox from '../components/Inbox';
import { motion } from 'framer-motion';

const MessagesPage = () => {
  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 ml-24 lg:ml-72 p-8 lg:p-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
        
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold tracking-tighter mb-2 italic uppercase">Collaboration Hub</h1>
            <p className="text-gray-500 font-medium italic">Track your enquiries and manage partner communications.</p>
          </motion.div>
        </header>

        {/* This component handles the Received/Sent tabs */}
        <Inbox />
      </main>
    </div>
  );
};

export default MessagesPage;