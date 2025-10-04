package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"orbital25/internal/config"
	"orbital25/internal/models"
	"orbital25/internal/services"
)

var nasaService *services.NASAService

func init() {
	cfg := config.Load()
	nasaService = services.NewNASAService(cfg.NASAAPIKey)
}

func NASAHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters for location
	latStr := r.URL.Query().Get("lat")
	lngStr := r.URL.Query().Get("lng")

	var lat, lng float64
	var err error

	if latStr != "" && lngStr != "" {
		lat, err = strconv.ParseFloat(latStr, 64)
		if err != nil {
			response := models.APIResponse{
				Success: false,
				Error:   "Invalid latitude parameter",
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(response)
			return
		}

		lng, err = strconv.ParseFloat(lngStr, 64)
		if err != nil {
			response := models.APIResponse{
				Success: false,
				Error:   "Invalid longitude parameter",
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	image, err := nasaService.GetEarthImagery(lat, lng)
	if err != nil {
		log.Printf("Error fetching NASA imagery: %v", err)
		response := models.APIResponse{
			Success: false,
			Error:   "Failed to fetch Earth imagery",
			Message: "Please try again later",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	response := models.APIResponse{
		Success: true,
		Data:    image,
		Message: "Earth imagery retrieved successfully",
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}