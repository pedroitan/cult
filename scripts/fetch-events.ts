import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    
    console.log('Formatted events:', formattedEvents);
    
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
