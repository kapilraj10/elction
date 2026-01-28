import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home/Home.jsx';
import Commitment from './components/Commitment/Commitment.jsx';
import Suggestions from './components/Suggestions/Suggestion.jsx';
import Login from './components/Login/Login.jsx';
import Admin from './page/Admin/Admin.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/commitment" element={<Commitment />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
