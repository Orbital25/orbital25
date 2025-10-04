package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"orbital25/internal/handlers"
	"orbital25/internal/models"
)

func TestISSHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		expectedStatus int
	}{
		{"Valid GET request", "GET", http.StatusOK},
		{"Invalid POST request", "POST", http.StatusMethodNotAllowed},
		{"Invalid PUT request", "PUT", http.StatusMethodNotAllowed},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/api/iss", nil)
			w := httptest.NewRecorder()

			handlers.ISSHandler(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			if tt.method == "GET" && w.Code == http.StatusOK {
				var response models.APIResponse
				if err := json.NewDecoder(w.Body).Decode(&response); err != nil {
					t.Errorf("Failed to decode response: %v", err)
				}

				if !response.Success {
					t.Error("Expected successful response")
				}
			}
		})
	}
}

func TestNASAHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		query          string
		expectedStatus int
	}{
		{"Valid GET request", "GET", "", http.StatusOK},
		{"GET with coordinates", "GET", "?lat=25.7617&lng=-80.1918", http.StatusOK},
		{"Invalid latitude", "GET", "?lat=invalid&lng=0", http.StatusBadRequest},
		{"Invalid longitude", "GET", "?lat=0&lng=invalid", http.StatusBadRequest},
		{"Invalid POST request", "POST", "", http.StatusMethodNotAllowed},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/api/nasa"+tt.query, nil)
			w := httptest.NewRecorder()

			handlers.NASAHandler(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

func TestNBLHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		body           string
		expectedStatus int
	}{
		{"Valid GET request", "GET", "", http.StatusOK},
		{"Valid POST request", "POST", `{"player_id":"test","score":"100","time_elapsed":"60","completed":true}`, http.StatusCreated},
		{"Invalid POST body", "POST", `{"invalid":"json"}`, http.StatusBadRequest},
		{"Invalid score format", "POST", `{"player_id":"test","score":"invalid","time_elapsed":"60","completed":true}`, http.StatusBadRequest},
		{"Invalid method", "DELETE", "", http.StatusMethodNotAllowed},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body := strings.NewReader(tt.body)
			req := httptest.NewRequest(tt.method, "/api/nbl", body)
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handlers.NBLHandler(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}