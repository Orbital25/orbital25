package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"orbital25/internal/models"
)

type NASAService struct {
	client *http.Client
	apiKey string
}

func NewNASAService(apiKey string) *NASAService {
	return &NASAService{
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
		apiKey: apiKey,
	}
}

func (s *NASAService) GetEarthImagery(lat, lng float64) (*models.NASAImage, error) {
	// Use NASA's EPIC API for Earth imagery
	apiURL := "https://api.nasa.gov/EPIC/api/natural/images"
	
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	q := url.Values{}
	if s.apiKey != "" {
		q.Add("api_key", s.apiKey)
	} else {
		q.Add("api_key", "DEMO_KEY")
	}
	req.URL.RawQuery = q.Encode()

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch NASA imagery: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("NASA API returned status %d", resp.StatusCode)
	}

	var images []struct {
		Identifier string `json:"identifier"`
		Caption    string `json:"caption"`
		Image      string `json:"image"`
		Date       string `json:"date"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&images); err != nil {
		return nil, fmt.Errorf("failed to decode NASA response: %w", err)
	}

	if len(images) == 0 {
		return s.getFallbackImage(), nil
	}

	// Use the most recent image
	img := images[0]
	date, _ := time.Parse("2006-01-02", img.Date)

	return &models.NASAImage{
		URL:         fmt.Sprintf("https://api.nasa.gov/EPIC/archive/natural/%s/png/%s.png?api_key=%s", img.Date, img.Image, s.getAPIKey()),
		Title:       "Earth from EPIC",
		Description: img.Caption,
		Date:        date,
		Location: models.Location{
			Latitude:  lat,
			Longitude: lng,
		},
	}, nil
}

func (s *NASAService) getFallbackImage() *models.NASAImage {
	return &models.NASAImage{
		URL:         "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
		Title:       "Earth View",
		Description: "Beautiful view of Earth from space",
		Date:        time.Now(),
	}
}

func (s *NASAService) getAPIKey() string {
	if s.apiKey != "" {
		return s.apiKey
	}
	return "DEMO_KEY"
}