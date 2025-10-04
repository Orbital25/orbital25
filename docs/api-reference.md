# API Reference

## Endpoints

### GET /api/iss
Returns current ISS position
- Response: `{"latitude": float, "longitude": float, "timestamp": string}`

### GET /api/nasa
Returns NASA Earth imagery
- Response: `{"image_url": string, "timestamp": string}`

### GET /api/nbl
Returns NBL simulation data
- Response: `{"simulation_active": boolean, "score": number}`