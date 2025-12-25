import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage'; // Restored
import ProfilePage from './pages/ProfilePage';
import EnquiryPage from './pages/EnquiryPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AIChat from './components/AIChat';

function App() {
  return (
    <Router>
      <div className="font-sans relative">
        <AIChat />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} /> {/* Restored */}
          <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/enquiry/:id" element={<ProtectedRoute><EnquiryPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;