// pages/api/nasa.js
export default async function handler(req, res) {
  try {
    // In a real deployment, you would replace this with the actual backend API endpoint
    // For now, we'll simulate fetching from the Go backend
    const { lat, lng } = req.query;
    const response = await fetch(`http://localhost:8080/api/nasa?lat=${lat || 0}&lng=${lng || 0}`);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    // In case the Go backend is not running, provide fallback mock data
    const mockNASAData = {
      success: true,
      data: {
        url: 'https://epic.gsfc.nasa.gov/archive/natural/2023/08/02/png/epic_1b_20230802003912.png',
        title: 'Earth from Space',
        description: 'Beautiful view of Earth from the International Space Station',
        date: new Date().toISOString(),
        location: {
          latitude: 25.7617,
          longitude: -80.1918
        }
      }
    };
    
    res.status(200).json(mockNASAData);
  }
}