package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"orbital25/internal/models"
)

func NBLHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		handleNBLStatus(w, r)
	case http.MethodPost:
		handleNBLScore(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleNBLStatus(w http.ResponseWriter, r *http.Request) {
	status := map[string]interface{}{
		"simulation_active": true,
		"max_score":        1000,
		"time_limit":       120, // seconds
		"difficulty":       "intermediate",
	}

	response := models.APIResponse{
		Success: true,
		Data:    status,
		Message: "NBL simulation status",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func handleNBLScore(w http.ResponseWriter, r *http.Request) {
	var scoreData struct {
		PlayerID    string `json:"player_id"`
		Score       string `json:"score"`
		TimeElapsed string `json:"time_elapsed"`
		Completed   bool   `json:"completed"`
	}

	if err := json.NewDecoder(r.Body).Decode(&scoreData); err != nil {
		response := models.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Validate and convert score
	score, err := strconv.Atoi(scoreData.Score)
	if err != nil {
		response := models.APIResponse{
			Success: false,
			Error:   "Invalid score format",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Validate and convert time
	timeElapsed, err := strconv.Atoi(scoreData.TimeElapsed)
	if err != nil {
		response := models.APIResponse{
			Success: false,
			Error:   "Invalid time format",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	nblScore := models.NBLScore{
		PlayerID:    scoreData.PlayerID,
		Score:       score,
		TimeElapsed: timeElapsed,
		Completed:   scoreData.Completed,
		Timestamp:   time.Now(),
	}

	// In a real app, save to database here
	log.Printf("NBL Score submitted: %+v", nblScore)

	response := models.APIResponse{
		Success: true,
		Data:    nblScore,
		Message: "Score recorded successfully",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}