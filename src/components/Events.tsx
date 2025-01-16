// Main Events component for displaying cultural events in different views
// Itan Tech
import React, { useEffect, useState } from 'react';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  url?: string;
  imageUrl?: string;
}

interface EventsProps {
  searchTerm: string;
}

export default function Events({ searchTerm }: EventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('grid');
  const [filters, setFilters] = useState({
    date: '',
    type: ''
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Helper function to parse both date formats
  const parseDate = (dateStr: string) => {
    // Handle "Domingo, DD de MMM" format
    if (dateStr.includes(',')) {
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'jan.': '01', 'fev': '02', 'fev.': '02', 
        'mar': '03', 'mar.': '03', 'abr': '04', 'abr.': '04',
        'mai': '05', 'mai.': '05', 'jun': '06', 'jun.': '06', 
        'jul': '07', 'jul.': '07', 'ago': '08', 'ago.': '08',
        'set': '09', 'set.': '09', 'out': '10', 'out.': '10', 
        'nov': '11', 'nov.': '11', 'dez': '12', 'dez.': '12'
      };
      
      const parts = dateStr.split(' ');
      const day = parts[1].padStart(2, '0');
      const month = monthMap[parts[3].toLowerCase()];
      const year = new Date().getFullYear().toString();
      
      return new Date(`${year}-${month}-${day}`);
    }
    
    // Handle "DD/MM/YYYY" format
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    const fetchFromGoogleSheets = async () => {
      try {
        console.log('Fetching data from Google Sheets...');
        const sheetId = '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs';
        const sheetName = 'Página2';
        const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
        
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
        );
        
        const data = await response.json();
        console.log('Google Sheets API response:', data);
        
        if (!data?.values) {
          console.error('Invalid sheet data format:', {
            response: data,
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          throw new Error(`Invalid sheet data format: ${response.status} ${response.statusText}`);
        }
        
        const rows = data.values.slice(1); // Skip header row
        const formattedEvents: Event[] = rows
          .filter(row => row?.length >= 7) // Ensure we have all required columns
          .map((row: string[]) => {
            // Ensure all required fields are present and properly typed
            const event = {
              title: row[0] ?? '',
              date: row[1] ?? '',
              time: row[2] ?? '',
              location: row[3] ?? '',
              type: row[4] ?? '',
              url: row[5] ?? '',
              imageUrl: row[6] ?? ''
            };
            return event as Event;
          });
        
        console.log('Formatted events:', formattedEvents);
        
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter and sort events
        const filteredAndSorted = formattedEvents
          .filter(event => {
            const eventDate = parseDate(event.date);
            // Include events from today and future dates
            const eventDay = new Date(eventDate);
            eventDay.setHours(0, 0, 0, 0);
            return eventDay >= today || eventDay.toDateString() === today.toDateString();
          })
          .sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateA.getTime() - dateB.getTime();
          });
        setEvents(filteredAndSorted);
      } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        // Fallback to local data
        console.log('Falling back to local events data...');
        try {
          const localData = await import('../data/events.json');
          // Get today's date at midnight for comparison
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Filter and sort local events
          const filteredAndSortedLocal = localData.default
            .filter(event => {
              const eventDate = parseDate(event.date);
              // Include events from today and future dates
              const eventDay = new Date(eventDate);
              eventDay.setHours(0, 0, 0, 0);
              return eventDay >= today || eventDay.toDateString() === today.toDateString();
            })
            .sort((a, b) => {
              const dateA = parseDate(a.date);
              const dateB = parseDate(b.date);
              return dateA.getTime() - dateB.getTime();
            });
          setEvents(filteredAndSortedLocal);
        } catch (localError) {
          console.error('Error loading local events:', localError);
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFromGoogleSheets();
  }, []);

  if (loading) {
    return <div className="text-gray-100">Loading events...</div>;
  }

  const filteredEvents = events
    .filter(event => event && event.title && event.location && event.type)
    .filter(event => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        event.title.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        event.type.toLowerCase().includes(searchLower)
      );
      
      const matchesFilters = (
        (!filters.date || event.date === filters.date) &&
        (!filters.type || event.type.toLowerCase() === filters.type.toLowerCase())
      );
      
      return matchesSearch && matchesFilters;
    });

  const uniqueTypes = [...new Set(events.map(event => event.type))];

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-4">
          <div className="relative">
            <DatePicker
              selected={filters.date ? parseDate(filters.date) : null}
              onChange={(date) => {
                if (date) {
                  const formattedDate = date.toLocaleDateString('pt-BR');
                  setFilters({...filters, date: formattedDate});
                } else {
                  setFilters({...filters, date: ''});
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              className="bg-gray-700 text-gray-100 rounded-md p-2 w-40"
              isClearable
              showYearDropdown
              dropdownMode="select"
              popperModifiers={[
                {
                  name: 'preventOverflow',
                  options: {
                    rootBoundary: 'viewport',
                    tether: false,
                    altAxis: true,
                  },
                  fn: (state) => {
                    const { x, y } = state;
                    return {
                      x: x,
                      y: y,
                    };
                  },
                },
              ]}
              popperPlacement="bottom-start"
            />
          </div>
          
          <select
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
            className="bg-gray-700 text-gray-100 rounded-md p-2"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-full">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            title="List view"
          >
            <ListBulletIcon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            title="Grid view"
          >
            <Squares2X2Icon className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'compact' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            title="Compact view"
          >
            <div className="grid grid-cols-2 gap-1 w-5 h-5 text-gray-300">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {filteredEvents.map((event, index) => (
            <a
              key={index}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full"
            >
              <div className="flex items-center space-x-4">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-100">{event.title}</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-300">
                      {event.date} | {event.time} | {event.location}
                    </p>
                    <p className="text-sm text-gray-400">{event.type}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
          {filteredEvents.map((event, index) => (
            <a 
              key={index}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative aspect-video">
                {event.imageUrl && (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                  <p className="text-sm">
                    {event.date} | {event.time}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <h2 className="text-lg font-bold mb-1 text-gray-100">{event.title}</h2>
                <div className="flex justify-between items-center text-sm mb-1">
                  <p className="text-gray-300">{event.location}</p>
                  <p className="text-gray-400">{event.type}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {filteredEvents.map((event, index) => (
            <a 
              key={index}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 text-sm"
            >
              <div className="relative aspect-video">
                {event.imageUrl && (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/50 text-white">
                  <p className="text-xs">
                    {event.date} | {event.time}
                  </p>
                </div>
              </div>
              <div className="p-2">
                <h2 className="text-base font-bold mb-0.5 text-gray-100">{event.title}</h2>
                <div className="flex justify-between items-center text-xs mb-0.5">
                  <p className="text-gray-300">{event.location}</p>
                  <p className="text-gray-400">{event.type}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
