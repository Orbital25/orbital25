const NASA_API_KEY = '9habhcIIQofd2V9FJOERni6w8mtj5YtCOfcwUSpV';

export const nasaAPI = {
  async getAPOD() {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getNeoWs(startDate?: string, endDate?: string) {
    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || start;
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getEONET() {
    const response = await fetch(
      `https://eonet.gsfc.nasa.gov/api/v3/events?api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getDONKI(startDate?: string, endDate?: string) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://api.nasa.gov/DONKI/notifications?startDate=${start}&endDate=${end}&type=all&api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getEPIC() {
    // The api.nasa.gov endpoint for EPIC is often unavailable.
    // Using the direct GSFC endpoint is more reliable.
    const response = await fetch('https://epic.gsfc.nasa.gov/api/natural');
    if (!response.ok) {
      throw new Error(`Failed to fetch EPIC data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  },

  getEPICImageUrl(image: any) {
    const date = image.date.split(' ')[0].replace(/-/g, '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${image.image}.png`;
  },

  async getMarsRoverPhotos(rover = 'curiosity', sol = 1000) {
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getExoplanets(limit = 10) {
    const response = await fetch(
      `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,sy_snum,sy_pnum,discoverymethod,disc_year+from+pscomppars&format=json`
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Exoplanet API Error:', errorText);
      throw new Error('Failed to fetch Exoplanet data. The API may be temporarily unavailable.');
    }
    const data: any[] = await response.json();
    // Filter out entries without a discovery year and sort by most recent
    return data.filter(p => p.disc_year).sort((a, b) => b.disc_year - a.disc_year).slice(0, limit);
  },

  async getTechport(projectId?: number) {
    if (projectId) {
      const response = await fetch(
        `https://api.nasa.gov/techport/api/projects/${projectId}?api_key=${NASA_API_KEY}`
      );
      return response.json();
    }
    const response = await fetch(
      `https://api.nasa.gov/techport/api/projects?api_key=${NASA_API_KEY}`
    );
    return response.json();
  },

  async getTechTransfer(query = '') {
    const searchQuery = query || 'space';
    const response = await fetch(
      `https://api.nasa.gov/techtransfer/patent/?${searchQuery}&api_key=${NASA_API_KEY}`
    );
    return response.json();
  }
};
