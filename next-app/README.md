# Orbitra - Next.js Frontend

This is the Next.js frontend for the Orbitra application, celebrating 25 years of the International Space Station. The application provides an interactive experience of the ISS Cupola views and Neutral Buoyancy Lab training.

## Features

- 6-screen experience as per the design specification:
  1. Landing Screen (Welcome)
  2. Cupola Experience (Sight)
  3. Neutral Buoyancy Lab (Weightlessness)
  4. Connection Screen (Bridging Space & Earth)
  5. Interactive Summary / Infographic
  6. Final Call-to-Action (Closing Screen)

- Real-time ISS tracking with Leaflet map integration
- Interactive Earth observation from the ISS Cupola
- NBL training simulation with Phaser.js
- Responsive design for all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

If you have a backend server running, you can configure the API endpoints:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## API Routes

This application includes API routes for:
- `/api/iss` - Get real-time ISS position data
- `/api/nasa` - Get NASA Earth imagery data

## Components

- `Layout.js` - Common layout with navigation
- `ISSMap.js` - Interactive map component with Leaflet
- `NBLGame.js` - Interactive NBL training game with Phaser

## Project Structure

- `pages/` - Next.js pages for routing
- `components/` - Reusable React components
- `styles/` - CSS modules for styling
- `utils/` - Utility functions (like ISS tracker)
- `public/` - Static assets

## Backend Integration

The application is designed to work with the Go backend from the original project. API routes in `/pages/api` proxy requests to the Go backend, with fallback mock data when the backend is not available.

## Deployment

The application is ready for deployment to Vercel or any other Next.js hosting platform.

```bash
npm run build
npm run start
```

## Credits

- Created for the NASA Space Apps Challenge
- Built with Next.js, React, Leaflet, and Phaser.js
- Data provided by NASA's Open APIs