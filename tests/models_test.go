package tests

import (
	"encoding/json"
	"testing"
	"time"

	"orbital25/internal/models"
)

func TestISSPosition(t *testing.T) {
	position := models.ISSPosition{
		Latitude:  25.7617,
		Longitude: -80.1918,
		Altitude:  408.0,
		Velocity:  27600,
		Timestamp: time.Now(),
	}

	t.Run("JSON Marshaling", func(t *testing.T) {
		data, err := json.Marshal(position)
		if err != nil {
			t.Errorf("Failed to marshal ISSPosition: %v", err)
		}

		var unmarshaled models.ISSPosition
		err = json.Unmarshal(data, &unmarshaled)
		if err != nil {
			t.Errorf("Failed to unmarshal ISSPosition: %v", err)
		}

		if unmarshaled.Latitude != position.Latitude {
			t.Errorf("Expected latitude %f, got %f", position.Latitude, unmarshaled.Latitude)
		}

		if unmarshaled.Longitude != position.Longitude {
			t.Errorf("Expected longitude %f, got %f", position.Longitude, unmarshaled.Longitude)
		}
	})
}

func TestNASAImage(t *testing.T) {
	image := models.NASAImage{
		URL:         "https://example.com/image.jpg",
		Title:       "Test Image",
		Description: "A test image",
		Date:        time.Now(),
		Location: models.Location{
			Latitude:  25.7617,
			Longitude: -80.1918,
		},
	}

	t.Run("JSON Marshaling", func(t *testing.T) {
		data, err := json.Marshal(image)
		if err != nil {
			t.Errorf("Failed to marshal NASAImage: %v", err)
		}

		var unmarshaled models.NASAImage
		err = json.Unmarshal(data, &unmarshaled)
		if err != nil {
			t.Errorf("Failed to unmarshal NASAImage: %v", err)
		}

		if unmarshaled.URL != image.URL {
			t.Errorf("Expected URL %s, got %s", image.URL, unmarshaled.URL)
		}

		if unmarshaled.Title != image.Title {
			t.Errorf("Expected title %s, got %s", image.Title, unmarshaled.Title)
		}
	})
}

func TestNBLScore(t *testing.T) {
	score := models.NBLScore{
		PlayerID:    "player123",
		Score:       1000,
		TimeElapsed: 120,
		Completed:   true,
		Timestamp:   time.Now(),
	}

	t.Run("JSON Marshaling", func(t *testing.T) {
		data, err := json.Marshal(score)
		if err != nil {
			t.Errorf("Failed to marshal NBLScore: %v", err)
		}

		var unmarshaled models.NBLScore
		err = json.Unmarshal(data, &unmarshaled)
		if err != nil {
			t.Errorf("Failed to unmarshal NBLScore: %v", err)
		}

		if unmarshaled.PlayerID != score.PlayerID {
			t.Errorf("Expected PlayerID %s, got %s", score.PlayerID, unmarshaled.PlayerID)
		}

		if unmarshaled.Score != score.Score {
			t.Errorf("Expected Score %d, got %d", score.Score, unmarshaled.Score)
		}

		if unmarshaled.Completed != score.Completed {
			t.Errorf("Expected Completed %t, got %t", score.Completed, unmarshaled.Completed)
		}
	})
}

func TestAPIResponse(t *testing.T) {
	response := models.APIResponse{
		Success: true,
		Data:    map[string]interface{}{"test": "data"},
		Message: "Success",
	}

	t.Run("JSON Marshaling", func(t *testing.T) {
		data, err := json.Marshal(response)
		if err != nil {
			t.Errorf("Failed to marshal APIResponse: %v", err)
		}

		var unmarshaled models.APIResponse
		err = json.Unmarshal(data, &unmarshaled)
		if err != nil {
			t.Errorf("Failed to unmarshal APIResponse: %v", err)
		}

		if unmarshaled.Success != response.Success {
			t.Errorf("Expected Success %t, got %t", response.Success, unmarshaled.Success)
		}

		if unmarshaled.Message != response.Message {
			t.Errorf("Expected Message %s, got %s", response.Message, unmarshaled.Message)
		}
	})

	t.Run("Error Response", func(t *testing.T) {
		errorResponse := models.APIResponse{
			Success: false,
			Error:   "Test error",
			Message: "Something went wrong",
		}

		data, err := json.Marshal(errorResponse)
		if err != nil {
			t.Errorf("Failed to marshal error response: %v", err)
		}

		var unmarshaled models.APIResponse
		err = json.Unmarshal(data, &unmarshaled)
		if err != nil {
			t.Errorf("Failed to unmarshal error response: %v", err)
		}

		if unmarshaled.Success {
			t.Error("Expected Success to be false for error response")
		}

		if unmarshaled.Error != errorResponse.Error {
			t.Errorf("Expected Error %s, got %s", errorResponse.Error, unmarshaled.Error)
		}
	})
}