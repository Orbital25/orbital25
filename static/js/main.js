// Main application controller
class OrbitraApp {
    constructor() {
        this.issData = null;
        this.nasaImagery = null;
        this.updateInterval = null;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Orbitra ISS Tracker initializing...');
            
            // Show loading state
            this.showLoading(true);
            
            // Initialize components in sequence
            await this.initMap();
            await this.initCupola();
            await this.initNBLGame();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            // Hide loading state
            this.showLoading(false);
            
            console.log('✅ Orbitra initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Orbitra:', error);
            this.showError('Failed to initialize application');
        }
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

    async fetchNASAImagery(lat = 0, lng = 0) {
        try {
            const url = `/api/nasa?lat=${lat}&lng=${lng}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch NASA imagery');
            }
            
            this.nasaImagery = data.data;
            return data.data;
        } catch (error) {
            console.error('Error fetching NASA imagery:', error);
            throw error;
        }
    }

    startRealTimeUpdates() {
        // Update ISS position every 5 seconds
        this.updateInterval = setInterval(async () => {
            try {
                const issData = await this.fetchISSData();
                if (issData && window.updateISSPosition) {
                    window.updateISSPosition(issData.latitude, issData.longitude);
                }
            } catch (error) {
                console.warn('Failed to update ISS position:', error);
            }
        }, 5000);
    }

    showLoading(show) {
        const loader = document.getElementById('loading');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    async initMap() {
        if (typeof initMap === 'function') {
            await initMap();
        }
    }

    async initCupola() {
        if (typeof initCupola === 'function') {
            await initCupola();
        }
    }

    async initNBLGame() {
        if (typeof initNBLGame === 'function') {
            await initNBLGame();
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.orbitraApp = new OrbitraApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.orbitraApp) {
        window.orbitraApp.destroy();
    }
});