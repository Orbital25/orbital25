# NASA Space Apps Challenge 2024 - Project Submission

## Project Name
**Orbitra - ISS 25th Anniversary Celebration Platform**

## High-Level Project Summary
Orbitra is an interactive web platform celebrating 25 years of the International Space Station through immersive experiences. We developed a comprehensive application featuring real-time ISS tracking, Cupola-style Earth observation views, and a Neutral Buoyancy Laboratory (NBL) training simulator. This addresses the NASA Space Apps Challenge by making space exploration accessible and educational, inspiring the next generation of space enthusiasts while showcasing the ISS's scientific achievements and Earth benefits over its remarkable 25-year journey.

## Link to Project Demo
*[Demo to be uploaded - 30-second walkthrough of live application showing ISS tracking, map interaction, and different sections]*

## Link to Final Project
**GitHub Repository:** https://github.com/[your-username]/orbital25
**Live Demo:** [Deploy to Vercel/Netlify and provide URL]

## Detailed Project Description

### What it does:
- **Real-time ISS Tracking:** Interactive map displaying current ISS position with orbital path visualization
- **Cupola Earth View:** Simulates the astronaut experience of observing Earth from the ISS Cupola
- **NBL Training Simulator:** Interactive game simulating astronaut training in the Neutral Buoyancy Laboratory
- **Educational Dashboard:** Statistics and information about the ISS's 25-year mission

### How it works:
- **Backend:** Go-based REST API server providing ISS position data, NASA imagery integration, and game simulation endpoints
- **Frontend:** Next.js application with responsive design, real-time updates via WebSocket connections
- **Data Integration:** Fetches live ISS coordinates, integrates NASA Earth imagery, and provides interactive visualizations

### Benefits:
- Makes space exploration accessible to the public
- Educational tool for STEM learning
- Celebrates ISS achievements and scientific contributions
- Inspires interest in space careers and research

### Tools & Technologies:
- **Backend:** Go, WebSocket, REST APIs
- **Frontend:** Next.js, React, JavaScript, CSS
- **Mapping:** Leaflet.js for interactive maps
- **Game Engine:** Phaser.js for NBL simulation
- **Deployment:** Docker containerization
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

### Backend (Go)
```
cmd/main.go              - Server entry point
internal/
├── handlers/            - API endpoint handlers
├── services/            - Business logic
├── models/              - Data structures
├── middleware/          - CORS, logging
└── websocket/           - Real-time updates
```

### Frontend (Next.js)
```
next-app/
├── pages/               - Application routes
├── components/          - Reusable UI components
├── styles/              - CSS modules
└── utils/               - Helper functions
```

### Key Features Implementation:
1. **ISS Tracking:** Real-time position updates with orbital visualization
2. **Interactive Map:** Leaflet.js integration with custom ISS markers
3. **Cupola View:** NASA imagery correlation with ISS position
4. **NBL Simulator:** Phaser.js game engine for training simulation
5. **Responsive Design:** Mobile-first approach with space-themed UI

### Data Flow:
1. Go backend fetches ISS data from NASA APIs
2. WebSocket connections provide real-time updates
3. Next.js frontend renders interactive components
4. User interactions trigger API calls and state updates
5. Educational content contextualizes the ISS experience

This project successfully demonstrates the intersection of space technology, education, and web development while celebrating the remarkable 25-year journey of the International Space Station.