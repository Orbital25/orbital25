// pages/api/iss.js
export default async function handler(req, res) {
  try {
    // In a real deployment, you would replace this with the actual backend API endpoint
    // For now, we'll simulate fetching from the Go backend
    const response = await fetch('http://localhost:8080/api/iss');
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    // In case the Go backend is not running, provide fallback mock data
    const mockISSData = {
      success: true,
      data: {
        latitude: Math.random() * 180 - 90,  // Random lat between -90 and 90
        longitude: Math.random() * 360 - 180,  // Random lng between -180 and 180
        timestamp: Date.now(),
        velocity: 27600,  // km/h
        altitude: 408  // km
      }
    };
    
    res.status(200).json(mockISSData);
  }
}