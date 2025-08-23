import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import Heatmap from "../pages/Heatmap";
import History from "../pages/History";



const App = () => {
  return (
    <Router>
      
      <div className="min-h-screen flex flex-col items-center 
                      bg-gradient-to-br from-green-100 via-amber-50 to-green-200">
        {/* Navigation */}
        <nav className="bg-green-900/90 backdrop-blur-md shadow-lg w-full py-4 
                        flex items-center justify-between px-8 rounded-b-2xl">
          {/* Website Name */}
          <div className="flex">
            <img src=".\AgriMitraLogo.jpg" alt="logo" className="h-8 w-8 mx-2 rounded-2xl"/>
            <div className="text-3xl font-bold text-amber-200 md:text-2xl tracking-wide">
            AgriMitra
          </div>
          </div>
          

          {/* Navigation Links */}
          <div className="flex space-x-12">
            <Link 
              to="/" 
              className="text-amber-100 font-semibold hover:text-yellow-300 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/heatmap" 
              className="text-amber-100 font-semibold hover:text-yellow-300 transition-colors"
            >
              Heatmap
            </Link>
            <Link 
              to="/history" 
              className="text-amber-100 font-semibold hover:text-yellow-300 transition-colors"
            >
              History
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-6 w-full max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
