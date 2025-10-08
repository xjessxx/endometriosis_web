import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Prediction from "./components/Prediction";

export default function App() {
   return (
    <Router>
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-purple-50 to-pink-50">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-purple-500 via-pink-400 to-teal-400 py-4 px-6 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              THYROID <span className="text-teal-100">CANCER</span> RECCURANCE PROBABILITY 
            </h1>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="text-white hover:text-gray-200 font-medium">Dashboard</Link>
            <Link to="/predict" className="text-white hover:text-gray-200 font-medium">Prediction</Link>
          </nav>
          <div>
            <span className="text-4xl text-pink-500">RIBBON</span>
          </div>
        </header>

        {/* Pages */}
        <main className="flex-1 w-full px-4 sm:px-8 md:px-16 lg:px-32 py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-600 bg-purple-100">
          💗 2025 Thyroid Recurrence Analytics | Awareness through Science 💜
        </footer>
      </div>
    </Router>
   );
  }
