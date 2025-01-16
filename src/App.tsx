import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Events from './components/Events';
import AdBanner from './components/AdBanner';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <AdBanner />
      {/* Header and Search */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cultural Agenda</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Component */}
      <Events searchTerm={searchTerm} />
    </div>
  );
}

export default App;
