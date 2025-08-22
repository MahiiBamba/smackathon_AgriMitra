import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import Heatmap from "../pages/Heatmap";
import History from "../pages/History";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        {/* Navigation */}
        <nav className="bg-white shadow-md w-full py-4 flex items-center justify-between px-8">
          {/* Website Name */}
          <div className="text-3xl font-bold text-green-700 md:text-2xl">AgriMitra</div>

          {/* Navigation Links */}
          <div className="flex space-x-12">
            <Link to="/" className="text-black font-semibold hover:underline">
              Home
            </Link>
            <Link to="/heatmap" className="text-black font-semibold hover:underline">
              Heatmap
            </Link>
            <Link to="/history" className="text-black font-semibold hover:underline">
              History
            </Link>
          </div>
        </nav>


        {/* Page Content */}
        <div className="p-6 w-full max-w-6xl ">
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
