class CupolaViewer {
    constructor() {
        this.container = null;
        this.currentImage = null;
        this.updateInterval = null;
        this.isLoading = false;
    }

    async init() {
        try {
            this.container = document.getElementById('earth-imagery');
            if (!this.container) {
                throw new Error('Earth imagery container not found');
            }

            this.setupUI();
            await this.loadEarthImagery();
            
            // Auto-update every 30 seconds
            this.updateInterval = setInterval(() => {
                this.loadEarthImagery();
            }, 30000);
            
            console.log('✅ Cupola viewer initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Cupola viewer:', error);
            throw error;
        }
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="cupola-header">
                <h3>🌍 Cupola Earth View</h3>
                <button id="refresh-imagery" class="refresh-btn">🔄 Refresh</button>
            </div>
            <div class="imagery-container">
                <div id="loading-imagery" class="loading-state">Loading Earth view...</div>
                <div id="image-display" class="image-display"></div>
                <div id="image-info" class="image-info"></div>
            </div>
        `;

        // Add refresh button listener
        const refreshBtn = document.getElementById('refresh-imagery');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadEarthImagery(true));
        }
    }

    async loadEarthImagery(force = false) {
        if (this.isLoading && !force) return;
        
        this.isLoading = true;
        this.showLoading(true);

        try {
            // Get current ISS position for context
            let lat = 0, lng = 0;
            if (window.orbitraApp && window.orbitraApp.issData) {
                lat = window.orbitraApp.issData.latitude;
                lng = window.orbitraApp.issData.longitude;
            }

            const nasaData = await window.orbitraApp.fetchNASAImagery(lat, lng);
            
            if (nasaData) {
                this.displayImage(nasaData);
                this.currentImage = nasaData;
            } else {
                this.showError('No Earth imagery available');
            }
        } catch (error) {
            console.error('Error loading Earth imagery:', error);
            this.showError('Failed to load Earth imagery');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    displayImage(imageData) {
        const imageDisplay = document.getElementById('image-display');
        const imageInfo = document.getElementById('image-info');
        
        if (!imageDisplay || !imageInfo) return;

        // Create image element with error handling
        const img = document.createElement('img');
        img.src = imageData.url;
        img.alt = imageData.title || 'Earth from space';
        img.className = 'earth-image';
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
        
        img.onload = () => {
            imageDisplay.innerHTML = '';
            imageDisplay.appendChild(img);
        };
        
        img.onerror = () => {
            this.showError('Failed to load image');
        };

        // Update image info
        const date = new Date(imageData.date).toLocaleDateString();
        imageInfo.innerHTML = `
            <div class="image-metadata">
                <p><strong>Title:</strong> ${imageData.title || 'Earth View'}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Description:</strong> ${imageData.description || 'Beautiful view of Earth from space'}</p>
                ${imageData.location ? `<p><strong>Location:</strong> ${imageData.location.latitude.toFixed(2)}°, ${imageData.location.longitude.toFixed(2)}°</p>` : ''}
            </div>
        `;
    }

    showLoading(show) {
        const loader = document.getElementById('loading-imagery');
        const display = document.getElementById('image-display');
        
        if (loader && display) {
            loader.style.display = show ? 'flex' : 'none';
            display.style.opacity = show ? '0.5' : '1';
        }
    }

    showError(message) {
        const imageDisplay = document.getElementById('image-display');
        if (imageDisplay) {
            imageDisplay.innerHTML = `
                <div class="error-state">
                    <p>⚠️ ${message}</p>
                    <button onclick="window.cupolaViewer.loadEarthImagery(true)">Try Again</button>
                </div>
            `;
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Global functions for backward compatibility
let cupolaViewerInstance = null;

async function initCupola() {
    cupolaViewerInstance = new CupolaViewer();
    await cupolaViewerInstance.init();
    window.cupolaViewer = cupolaViewerInstance;
}

async function loadEarthImagery() {
    if (cupolaViewerInstance) {
        await cupolaViewerInstance.loadEarthImagery();
    }
}