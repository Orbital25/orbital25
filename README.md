
  # Space Academy
  
##  Overview

Space Academy is an immersive educational platform that allows users to simulate the experience of being an astronaut. Built for the NASA Space Apps Challenge 2024, it features interactive modules including real-time Earth observation from the ISS, astronaut training simulations, and mission-based learning experiences integrated with NASA APIs.

##  Key Features

- **Real-time ISS Tracking**: Interactive map with live ISS position and orbital path visualization
- **Cupola Earth View**: Experience Earth observation from the astronaut's perspective using NASA imagery
- **NBL Training Simulator**: Interactive Neutral Buoyancy Laboratory spacewalk training simulation
- **Mission Dashboard**: Live statistics including altitude, velocity, and orbital information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: WebSocket connections for live data streaming

##  Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Icons**: Lucide React
- **APIs**: NASA Open Data integration

##  Quick Start

### Prerequisites
- **Node.js**: 18+ and npm
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Orbital25/orbital25.git
   cd orbital25
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local with your Supabase credentials
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - **Application**: http://localhost:5173

### Using Docker (Alternative)
```bash
docker-compose up --build
```

##  Project Structure

```
orbital25/
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── Auth.tsx      # Authentication component
│   │   ├── CupolaMode.tsx # ISS Cupola view
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── NBLMode.tsx   # NBL training simulator
│   │   └── ...
│   ├── contexts/         # React contexts
│   ├── lib/              # Utility libraries
│   │   ├── nasa.ts       # NASA API integration
│   │   └── supabase.ts   # Supabase client
│   └── App.tsx           # Main app component
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
├── index.html            # Entry HTML file
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

##  API Integration

- **ISS Position**: Open Notify API for real-time ISS coordinates
- **NASA Imagery**: NASA Image and Video Library integration
- **Earth Observation**: Client-side data processing and visualization
- **Real-time Updates**: Periodic API polling for live data

##  NASA Data Integration

- **ISS Position API**: Real-time coordinates from Open Notify API
- **NASA Earth Imagery**: High-resolution astronaut photography
- **Orbital Parameters**: Altitude, velocity, and trajectory data
- **Mission Information**: Current crew and expedition details

##  Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#
## Contributors

[STEPHEN OGINGA](https://gitHUB/steodhiambo)

[OUMA OUMA](https://github.com/oumaoumag)

[TOMLEE ABILA](https://github.com/oumaoumag)

[JOSEPH OWINO](https://github.com/oumaoumag)

[TEDDY SIAKA](https://github.com/)


## License

This project is licensed under the [MIT](https://opensource.org/license/mit) License.

