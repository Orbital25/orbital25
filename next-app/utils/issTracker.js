// utils/issTracker.js
export class ISSTracker {
  constructor() {
    this.issData = null;
    this.updateInterval = null;
    this.onUpdate = null;
  }

  async fetchISSData() {
    try {
      const response = await fetch('/api/iss');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch ISS data');
      }
      
      this.issData = data.data;
      return data.data;
    } catch (error) {
      console.error('Error fetching ISS data:', error);
      throw error;
    }
  }

  async startTracking(callback) {
    this.onUpdate = callback;
    
    // Initial fetch
    await this.fetchISSData();
    if (this.onUpdate) {
      this.onUpdate(this.issData);
    }
    
    // Update position every 5 seconds
    this.updateInterval = setInterval(async () => {
      try {
        await this.fetchISSData();
        if (this.onUpdate) {
          this.onUpdate(this.issData);
        }
      } catch (error) {
        console.warn('Failed to update ISS position:', error);
      }
    }, 5000);
  }

  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}