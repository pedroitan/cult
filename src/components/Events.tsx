import { useEffect, useState } from 'react';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  url: string;
  imageUrl: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        if (!data.values) {
          throw new Error('Invalid sheet data format');
        }
        
        const rows = data.values.slice(1); // Skip header row
        const formattedEvents = rows.map((row: string[]) => ({
          title: row[0],
          date: row[1],
          time: row[2],
          location: row[3],
          type: row[4],
          url: row[5],
          imageUrl: row[6],
        }));
        
        console.log('Formatted events:', formattedEvents);
        
        // Write to local JSON file
        const jsonData = JSON.stringify(formattedEvents, null, 2);
        console.log('Writing data to local JSON file...');
        await fetch('/api/write-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonData,
        });
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        // Fallback to local data
        console.log('Falling back to local events data...');
        try {
          const localData = await import('../data/events.json');
          setEvents(localData.default);
        } catch (localError) {
          console.error('Error loading local events:', localError);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events.map((event, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              More Info
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
