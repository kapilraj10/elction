import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home/Home.jsx';
import Commitment from './components/Commitment/Commitment.jsx';
import Suggestions from './components/Suggestions/Suggestion.jsx';
import Login from './components/Login/Login.jsx';
import About from './pages/About/About.jsx';
import NewsMedia from './pages/NewsMedia/NewsMedia.jsx';
import Admin from './page/Admin/Admin.jsx';
import Dashboard from './page/Dashboard/Dashboard.jsx';
import Suggestion from './page/suggestion/Suggestion.jsx';
import AdminCommitments from './page/Admin/CommitmentsAdmin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news-media" element={<NewsMedia />} />
        <Route path="suggestions" element={<Suggestions />} />
        <Route path="commitment" element={<Commitment />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="suggestions" element={<Suggestion />} />
          <Route path="commitments" element={<AdminCommitments />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
