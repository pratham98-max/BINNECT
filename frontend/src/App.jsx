import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import your page components
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import EnquiryPage from './pages/EnquiryPage'; // Added this import

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Business Discovery */}
          <Route path="/explore" element={<ExplorePage />} />
          
          {/* User Workspace */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Registration Form */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Saved Businesses */}
          <Route path="/saved" element={<SavedPage />} />

          {/* Dynamic Profile Route */}
          <Route path="/profile/:id" element={<ProfilePage />} />
          
          {/* 2. THE NEW DYNAMIC ENQUIRY ROUTE */}
          {/* This allows users to reach /enquiry/[business-id] */}
          <Route path="/enquiry/:id" element={<EnquiryPage />} />
          
          {/* Catch-all for mistakes */}
          <Route path="*" element={
            <div className="p-20 text-center font-black uppercase italic bg-[#050505] min-h-screen text-white">
              <h1 className="text-6xl mb-4">404</h1>
              <p>Niche Not Found</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;