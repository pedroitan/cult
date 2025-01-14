import fs = require('fs');
import path = require('path');
import { fileURLToPath } from 'url';

const __dirname = path.resolve();

type SheetEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  url: string;
  imageUrl: string;
};

async function fetchEvents() {
  try {
    console.log('Fetching data from Google Sheets...');
    const sheetId = '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs';
    const sheetName = 'Sheet1';
    const apiKey = process.env.VITE_GOOGLE_SHEETS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Sheets API key is missing');
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
    );
    
    const data = await response.json();
    console.log('Google Sheets API response:', data);
    
    if (!data.values) {
      throw new Error('Invalid sheet data format');
    }
    
    const rows = data.values.slice(1); // Skip header row
    const formattedEvents: SheetEvent[] = rows.map((row: string[]) => ({
      title: row[0],
      date: row[1],
      time: row[2],
      location: row[3],
      type: row[4],
      url: row[5],
      imageUrl: row[6],
    }));

    // Sort events by date
    formattedEvents.sort((a, b) => {
      const parseDate = (dateString: string) => {
        const parts = dateString.split(' - ')[0].split(', ');
        if (parts.length > 1) {
          // Handle format like "Sexta, 10 de Jan"
          const [day, month] = parts[1].split(' de ');
          const year = '2025'; // Assuming the year is always 2025 for this dataset
          return new Date(`${month} ${day}, ${year}`).getTime();
        } else {
          // Handle format like "07/01/2025"
          const [day, month, year] = dateString.split('/');
          return new Date(`${year}-${month}-${day}`).getTime();
        }
      };

      return parseDate(a.date) - parseDate(b.date);
    });
    console.log('Sorted events:', formattedEvents);
    
    // Write to local JSON file
    const filePath = path.resolve(__dirname, '../src/data/events.json');
    fs.writeFileSync(filePath, JSON.stringify(formattedEvents, null, 2));
    console.log('Successfully wrote events to src/data/events.json');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fetchEvents();
