import React, { useEffect, useState } from 'react';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

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
  const [isListView, setIsListView] = useState(false);

  // Helper function to parse both date formats
  const parseDate = (dateStr: string) => {
    // Handle "Domingo, DD de MMM" format
    if (dateStr.includes(',')) {
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
        'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
        'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
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
        const sheetName = 'Sheet1';
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
            return eventDate >= today;
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
              return eventDate >= today;
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
    return <div>Loading events...</div>;
  }

  const filteredEvents = events
    .filter(event => event && event.title && event.location && event.type)
    .filter(event => {
      const searchLower = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        event.type.toLowerCase().includes(searchLower)
      );
    });

  return (
    <div>
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsListView(!isListView)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isListView ? "Switch to grid view" : "Switch to list view"}
        >
          {isListView ? (
            <Squares2X2Icon className="w-6 h-6" />
          ) : (
            <ListBulletIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {isListView ? (
        <div className="space-y-4 p-4">
          {filteredEvents.map((event, index) => (
            <a
              key={index}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
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
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-gray-600">
                    {event.date} | {event.time} | {event.location}
                  </p>
                  <p className="text-sm text-gray-500">{event.type}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredEvents.map((event, index) => (
            <a 
              key={index}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {event.imageUrl && (
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">
                  {event.date} | {event.time}
                </p>
                <p className="text-gray-600 mb-2">{event.location}</p>
                <p className="text-sm text-gray-500 mb-4">{event.type}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
