package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"orbital25/internal/models"
)

type ISSService struct {
	client      *http.Client
	apiURL      string
	cache       *models.ISSPosition
	cacheMutex  sync.RWMutex
	lastFetch   time.Time
	cacheExpiry time.Duration
}

func NewISSService(apiURL string, cacheExpiry time.Duration) *ISSService {
	return &ISSService{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiURL:      apiURL,
		cacheExpiry: cacheExpiry,
	}
}

func (s *ISSService) GetPosition() (*models.ISSPosition, error) {
	s.cacheMutex.RLock()
	if s.cache != nil && time.Since(s.lastFetch) < s.cacheExpiry {
		defer s.cacheMutex.RUnlock()
		return s.cache, nil
	}
	s.cacheMutex.RUnlock()

	// Fetch fresh data
	resp, err := s.client.Get(s.apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch ISS data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ISS API returned status %d", resp.StatusCode)
	}

	var apiResp struct {
		ISSPosition struct {
			Latitude  string `json:"latitude"`
			Longitude string `json:"longitude"`
		} `json:"iss_position"`
		Timestamp int64 `json:"timestamp"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed to decode ISS response: %w", err)
	}

	// Parse coordinates
	lat, lng, err := parseCoordinates(apiResp.ISSPosition.Latitude, apiResp.ISSPosition.Longitude)
	if err != nil {
		return nil, fmt.Errorf("failed to parse coordinates: %w", err)
	}

	position := &models.ISSPosition{
		Latitude:  lat,
		Longitude: lng,
		Altitude:  408.0, // Average ISS altitude in km
		Velocity:  27600, // Average ISS velocity in km/h
		Timestamp: time.Unix(apiResp.Timestamp, 0),
	}

	// Update cache
	s.cacheMutex.Lock()
	s.cache = position
	s.lastFetch = time.Now()
	s.cacheMutex.Unlock()

	return position, nil
}

func parseCoordinates(latStr, lngStr string) (float64, float64, error) {
	var lat, lng float64
	if _, err := fmt.Sscanf(latStr, "%f", &lat); err != nil {
		return 0, 0, err
	}
	if _, err := fmt.Sscanf(lngStr, "%f", &lng); err != nil {
		return 0, 0, err
	}
	return lat, lng, nil
}