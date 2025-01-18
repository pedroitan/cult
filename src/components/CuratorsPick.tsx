import React from 'react';
import { Event } from './Events';

interface CuratorsPickProps {
  events: Event[];
}

const CuratorsPick: React.FC<CuratorsPickProps> = ({ events }) => {
  // Sort events by date (soonest first) and prioritize certain types
  const topPicks = events
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    })
    .sort((a, b) => {
      // Priority types: 'Exposição', 'Teatro', 'Música'
      const priorityTypes = ['Exposição', 'Teatro', 'Música'];
      const aPriority = priorityTypes.includes(a.type) ? 1 : 0;
      const bPriority = priorityTypes.includes(b.type) ? 1 : 0;
      return bPriority - aPriority;
    })
    .slice(0, 5);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Curator's Picks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topPicks.map((event, index) => (
          <a
            key={index}
            href={event.url || '#'}
            className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img 
              src={event.imageUrl || '/images/default-event.jpg'} 
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-100 mb-2">{event.title}</h2>
              <div className="text-gray-300">
                <p>{event.date} | {event.time}</p>
                <p>{event.location}</p>
                <p className="text-sm text-gray-400">{event.type}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CuratorsPick;
