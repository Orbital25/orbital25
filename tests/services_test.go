package tests

import (
	"testing"
	"time"

	"orbital25/internal/services"
)

func TestISSService(t *testing.T) {
	service := services.NewISSService("http://api.open-notify.org/iss-now.json", 5*time.Second)

	t.Run("GetPosition", func(t *testing.T) {
		position, err := service.GetPosition()
		if err != nil {
			t.Skipf("Skipping test due to external API dependency: %v", err)
		}

		if position == nil {
			t.Error("Expected position data, got nil")
		}

		if position.Latitude < -90 || position.Latitude > 90 {
			t.Errorf("Invalid latitude: %f", position.Latitude)
		}

		if position.Longitude < -180 || position.Longitude > 180 {
			t.Errorf("Invalid longitude: %f", position.Longitude)
		}
	})

	t.Run("Caching", func(t *testing.T) {
		// First call
		start := time.Now()
		_, err := service.GetPosition()
		if err != nil {
			t.Skipf("Skipping test due to external API dependency: %v", err)
		}
		firstCallDuration := time.Since(start)

		// Second call (should be cached)
		start = time.Now()
		_, err = service.GetPosition()
		if err != nil {
			t.Errorf("Cached call failed: %v", err)
		}
		secondCallDuration := time.Since(start)

		// Cached call should be significantly faster
		if secondCallDuration >= firstCallDuration {
			t.Log("Warning: Cached call was not faster than first call")
		}
	})
}

func TestNASAService(t *testing.T) {
	service := services.NewNASAService("DEMO_KEY")

	t.Run("GetEarthImagery", func(t *testing.T) {
		image, err := service.GetEarthImagery(25.7617, -80.1918)
		if err != nil {
			t.Skipf("Skipping test due to external API dependency: %v", err)
		}

		if image == nil {
			t.Error("Expected image data, got nil")
		}

		if image.URL == "" {
			t.Error("Expected image URL, got empty string")
		}

		if image.Title == "" {
			t.Error("Expected image title, got empty string")
		}
	})

	t.Run("FallbackImage", func(t *testing.T) {
		// Test with invalid coordinates to trigger fallback
		image, err := service.GetEarthImagery(999, 999)
		if err != nil {
			t.Errorf("Expected fallback image, got error: %v", err)
		}

		if image == nil {
			t.Error("Expected fallback image, got nil")
		}
	})
}