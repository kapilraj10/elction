import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Commitment from './components/Commitment/Commitment.jsx';
import Suggestions from './components/Suggestions/Suggestion.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/commitment" element={<Commitment />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Routes>
    </Router>
  );
}

export default App;
