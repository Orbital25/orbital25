# NASA Space Apps Challenge 2024 - Project Submission

## Project Name
**Orbitra - ISS 25th Anniversary Celebration Platform**

## High-Level Project Summary
Orbitra is an interactive web platform celebrating 25 years of the International Space Station through immersive experiences. We developed a comprehensive application featuring real-time ISS tracking, Cupola-style Earth observation views, and a Neutral Buoyancy Laboratory (NBL) training simulator. This addresses the NASA Space Apps Challenge by making space exploration accessible and educational, inspiring the next generation of space enthusiasts while showcasing the ISS's scientific achievements and Earth benefits over its remarkable 25-year journey.

## Link to Project Demo
*[Demo to be uploaded - 30-second walkthrough of live application showing ISS tracking, map interaction, and different sections]*

## Link to Final Project
**GitHub Repository:** https://github.com/Orbital25/orbital25.git

**Live Demo:** [https://orbital25-rho.vercel.app/]

## Detailed Project Description

### What it does:
- **Real-time ISS Tracking:** Interactive map displaying current ISS position with orbital path visualization
- **Cupola Earth View:** Simulates the astronaut experience of observing Earth from the ISS Cupola
- **NBL Training Simulator:** Interactive game simulating astronaut training in the Neutral Buoyancy Laboratory
- **Educational Dashboard:** Statistics and information about the ISS's 25-year mission

### How it works:
- **Frontend:** React 18 with TypeScript application built with Vite, featuring responsive design and real-time updates
- **Backend:** Supabase provides authentication, PostgreSQL database, and storage services
- **Data Integration:** Fetches live ISS coordinates from NASA Open Notify API, integrates NASA Earth imagery, and provides interactive visualizations
- **Real-time Updates:** Periodic API polling for live ISS position and orbital data

### Benefits:
- Makes space exploration accessible to the public
- Educational tool for STEM learning
- Celebrates ISS achievements and scientific contributions
- Inspires interest in space careers and research

### Tools & Technologies:
- **Frontend:** React 18, TypeScript, Vite 5.4
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **UI Components:** Lucide React icons
- **APIs:** NASA Open Data integration
- **Build Tool:** Vite for fast development and building
- **Version Control:** Git with structured commit history

## NASA Data

### Primary NASA Data Sources:
- **ISS Position API:** Real-time coordinates from `api.open-notify.org/iss-now.json`
- **NASA Earth Imagery:** High-resolution astronaut photography from NASA Image and Video Library
- **ISS Mission Data:** Orbital parameters, altitude, velocity, and crew information
- **Earth Observation Data:** NASA Earthdata GIBS API for contextual Earth science data

### Usage Implementation:
- Live ISS tracking with 5-second update intervals
- Geographical correlation between ISS position and Earth imagery
- Educational content about ISS scientific experiments and Earth benefits
- Historical mission data integration for the 25-year timeline

## Space Agency Partner & Other Data

### NASA Resources:
- NASA Open Data Portal
- NASA Image and Video Library
- ISS National Lab educational materials
- NASA Earthdata APIs

### Open Source Libraries:
- Leaflet.js (mapping)
- Phaser.js (game engine)
- Next.js framework
- Go standard libraries

### Additional Resources:
- OpenStreetMap tiles for base mapping
- Web fonts from Google Fonts
- Icons and UI elements (custom designed)

## Use of Artificial Intelligence

### AI Tools Utilized:
- **GitHub Copilot:** Code completion and suggestion for Go backend development and JavaScript frontend logic
- **ChatGPT/Claude:** Project planning assistance, documentation writing, and code review suggestions

### AI Usage Details:
- Code generation was human-reviewed and modified for project-specific requirements
- AI-assisted debugging and optimization suggestions
- Documentation and README content enhancement
- No AI-generated images, videos, or audio content used
- All code implementations were validated and tested by human developers

### AI Content Acknowledgment:
All AI-assisted code includes comments indicating AI tool usage and has been thoroughly reviewed, tested, and modified by the development team to ensure functionality and originality.

## Project Submission Verification
✅ Confirmed understanding of project submission requirements
✅ Reviewed Participant Terms and Conditions and Privacy Policy
✅ Project contains no prohibited content as outlined in the guidelines
✅ All intellectual property rights are properly held
✅ No personally identifiable information included
✅ NASA branding guidelines respected

---

## Technical Architecture

### Frontend (React + TypeScript)
```
src/
├── components/          - React components
│   ├── Auth.tsx         - Authentication component
│   ├── CupolaMode.tsx   - ISS Cupola view
│   ├── Dashboard.tsx    - Main dashboard
│   ├── NBLMode.tsx      - NBL training simulator
│   └── ...
├── contexts/            - React contexts
├── lib/                 - Utility libraries
│   ├── nasa.ts          - NASA API integration
│   └── supabase.ts      - Supabase client
└── App.tsx              - Main app component
```

### Backend (Supabase)
```
supabase/
└── migrations/          - Database migrations
```

### Build & Configuration
```
├── index.html           - Entry HTML file
├── package.json         - Dependencies
├── vite.config.ts       - Vite configuration
└── tailwind.config.js   - Tailwind CSS config
```

### Tech Stack:
- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **UI Icons:** Lucide React
- **APIs:** NASA Open Data integration

### Key Features Implementation:
1. **ISS Tracking:** Real-time position updates with orbital visualization
2. **Interactive Map:** Live ISS position and orbital path visualization
3. **Cupola View:** Earth observation from astronaut's perspective using NASA imagery
4. **NBL Simulator:** Interactive Neutral Buoyancy Laboratory spacewalk training
5. **Responsive Design:** Optimized for desktop, tablet, and mobile devices

### Data Flow:
1. React frontend fetches ISS data from NASA Open Notify API
2. Supabase handles authentication and data storage
3. Real-time updates via periodic API polling
4. NASA imagery integration for Earth observation
5. TypeScript ensures type safety across components

This project successfully demonstrates the intersection of space technology, education, and web development while celebrating the remarkable 25-year journey of the International Space Station.