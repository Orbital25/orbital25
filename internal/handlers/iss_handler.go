package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"orbital25/internal/cache"
	"orbital25/internal/config"
	"orbital25/internal/metrics"
	"orbital25/internal/models"
	"orbital25/internal/services"
	"orbital25/internal/websocket"
)

var (
	issService  *services.ISSService
	globalCache *cache.Cache
	wsHub       *websocket.Hub
)

func init() {
	cfg := config.Load()
	issService = services.NewISSService(cfg.ISSAPIURL, cfg.CacheTimeout)
	globalCache = cache.New()
}

func SetWebSocketHub(hub *websocket.Hub) {
	wsHub = hub
}

func ISSHandler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	defer func() {
		metrics.RecordResponseTime(time.Since(start))
		metrics.IncrementRequests()
		metrics.IncrementISSRequests()
	}()

	if r.Method != http.MethodGet {
		metrics.IncrementErrors()
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Check cache first
	if cached, found := globalCache.Get("iss_position"); found {
		response := models.APIResponse{
			Success: true,
			Data:    cached,
			Message: "ISS position retrieved from cache",
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
		return
	}

	position, err := issService.GetPosition()
	if err != nil {
		metrics.IncrementErrors()
		log.Printf("Error fetching ISS position: %v", err)
		response := models.APIResponse{
			Success: false,
			Error:   "Failed to fetch ISS position",
			Message: "Please try again later",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Cache the result
	globalCache.Set("iss_position", position, 5*time.Second)

	// Broadcast to WebSocket clients
	if wsHub != nil {
		wsHub.BroadcastISSUpdate(position)
	}

	response := models.APIResponse{
		Success: true,
		Data:    position,
		Message: "ISS position retrieved successfully",
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}