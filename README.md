# Agenda Cultural - React Application

## Overview
This is a React application that displays cultural events from various sources. It provides three different view modes:
1. List View - Detailed view with event descriptions
2. Grid View - Compact cards with images
3. Compact View - Minimalistic view for quick browsing

## Features
- Dark mode by default
- Responsive design for all screen sizes
- Multiple view modes (List, Grid, Compact)
- Date filtering
- Location search
- Event type filtering
- Real-time data fetching from Google Sheets
- Fallback to local JSON data

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with your Google Sheets API key:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```
4. Start the development server:
```bash
npm run dev
```

## Usage
- Use the date picker to filter events by date
- Search for events by location
- Filter events by type using the dropdown
- Switch between view modes using the icons in the top right corner:
  - List view (detailed view)
  - Grid view (image-focused view)
  - Compact view (minimal view)

## Project Structure
```
src/
├── components/        # React components
├── data/              # Local event data
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
```

## Dependencies
- React
- Tailwind CSS
- Heroicons
- React Datepicker
- Vite

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License
MIT

## Credits
Itan Tech
