import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Events from './components/Events';
import AdBanner from './components/AdBanner';
import CuratorsPick from './components/CuratorsPick';
import Roteiros from './components/Roteiros';
import { Event } from './components/Events';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'curators' | 'roteiros'>('events');
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1240' }}>
      {/* Header and Navigation */}
      <div style={{ backgroundColor: '#1C1240' }}>
        <AdBanner />
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <h1 className="text-3xl font-bold text-white mb-6">Na Pista!</h1>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'events'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-dark text-gray-300 hover:bg-dark/90'
              }`}
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('curators')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'curators'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-dark text-gray-300 hover:bg-dark/90'
              }`}
            >
              Curadoria
            </button>
            <button
              onClick={() => setActiveTab('roteiros')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'roteiros'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-dark text-gray-300 hover:bg-dark/90'
              }`}
            >
              Roteiros
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-600 bg-dark text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'events' ? (
        <Events searchTerm={searchTerm} onEventsLoaded={setEvents} />
      ) : activeTab === 'curators' ? (
        <CuratorsPick events={events} />
      ) : (
        <Roteiros />
      )}
    </div>
  );
}

export default App;
