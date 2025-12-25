import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import your page components
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import EnquiryPage from './pages/EnquiryPage';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure you create this file!
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {/* Public Route: Anyone can see the Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes: These require a login to access */}
          <Route path="/explore" element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/register" element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          } />
          
          <Route path="/saved" element={
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          } />

          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/enquiry/:id" element={
            <ProtectedRoute>
              <EnquiryPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
  <ProtectedRoute>
    <MessagesPage />
  </ProtectedRoute>
} />
          
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