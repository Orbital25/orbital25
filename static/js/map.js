class ISSMap {
    constructor() {
        this.map = null;
        this.issMarker = null;
        this.orbitPath = [];
        this.orbitPolyline = null;
        this.isTracking = false;
    }

    async init() {
        try {
            // Initialize Leaflet map
            this.map = L.map('map', {
                center: [0, 0],
                zoom: 2,
                zoomControl: true,
                attributionControl: true
            });

            // Add tile layer with better styling
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors | ISS Data: Open Notify API',
                maxZoom: 18,
                minZoom: 2
            }).addTo(this.map);

            // Add custom ISS icon
            this.issIcon = L.divIcon({
                html: '🛰️',
                iconSize: [30, 30],
                className: 'iss-icon'
            });

            // Initial ISS position load
            await this.trackISS();
            
            console.log('✅ Map initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize map:', error);
            throw error;
        }
    }

    async trackISS() {
        try {
            const issData = await window.orbitraApp.fetchISSData();
            if (issData) {
                this.updateISSPosition(issData.latitude, issData.longitude);
                this.updateOrbitPath(issData.latitude, issData.longitude);
            }
        } catch (error) {
            console.warn('Failed to track ISS:', error);
        }
    }

    updateISSPosition(lat, lng) {
        // Remove existing marker
        if (this.issMarker) {
            this.map.removeLayer(this.issMarker);
        }

        // Create new marker with popup
        this.issMarker = L.marker([lat, lng], { icon: this.issIcon })
            .addTo(this.map)
            .bindPopup(this.createISSPopup(lat, lng))
            .openPopup();

        // Center map on ISS (smooth animation)
        this.map.setView([lat, lng], this.map.getZoom(), {
            animate: true,
            duration: 1
        });
    }

    updateOrbitPath(lat, lng) {
        // Add to orbit path (keep last 50 points)
        this.orbitPath.push([lat, lng]);
        if (this.orbitPath.length > 50) {
            this.orbitPath.shift();
        }

        // Update orbit polyline
        if (this.orbitPolyline) {
            this.map.removeLayer(this.orbitPolyline);
        }

        if (this.orbitPath.length > 1) {
            this.orbitPolyline = L.polyline(this.orbitPath, {
                color: '#00ff88',
                weight: 2,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(this.map);
        }
    }

    createISSPopup(lat, lng) {
        const speed = 27600; // km/h
        const altitude = 408; // km
        
        return `
            <div class="iss-popup">
                <h3>🚀 International Space Station</h3>
                <p><strong>Position:</strong> ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</p>
                <p><strong>Altitude:</strong> ${altitude} km</p>
                <p><strong>Speed:</strong> ${speed.toLocaleString()} km/h</p>
                <p><strong>Crew:</strong> 7 astronauts</p>
                <button onclick="window.issMap.focusOnISS()">Follow ISS</button>
            </div>
        `;
    }

    focusOnISS() {
        if (this.issMarker) {
            const pos = this.issMarker.getLatLng();
            this.map.setView([pos.lat, pos.lng], 4, {
                animate: true,
                duration: 1.5
            });
        }
    }

    toggleTracking() {
        this.isTracking = !this.isTracking;
        return this.isTracking;
    }
}

// Global functions for backward compatibility
let issMapInstance = null;

async function initMap() {
    issMapInstance = new ISSMap();
    await issMapInstance.init();
    window.issMap = issMapInstance;
}

function updateISSPosition(lat, lng) {
    if (issMapInstance) {
        issMapInstance.updateISSPosition(lat, lng);
    }
}

// Export for global access
window.updateISSPosition = updateISSPosition;