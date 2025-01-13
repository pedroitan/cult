import { google } from 'googleapis';
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
    console.log('Authenticating with service account...');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(__dirname, '../../firm-reef-447023-b0-93c82563ab42.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs';
    const range = 'A:G'; // Use simple column range without sheet name

    console.log('Fetching data from Google Sheets...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const data = response.data;
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
    const filePath = path.resolve(__dirname, '../../src/data/events.json');
    fs.writeFileSync(filePath, JSON.stringify(formattedEvents, null, 2));
    console.log('Successfully wrote events to src/data/events.json');
    
  } catch (err) {
    const error = err as {
      response?: {
        data: any;
        status: number;
        headers: any;
      };
      request?: any;
      message?: string;
    };
    
    if (error.response) {
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

fetchEvents();
