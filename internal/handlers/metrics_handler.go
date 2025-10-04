package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"orbital25/internal/metrics"
	"orbital25/internal/models"
)

func MetricsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	m := metrics.GetMetrics()
	m.Mutex.RLock()
	
	var avgResponseTime time.Duration
	if len(m.ResponseTimes) > 0 {
		var total time.Duration
		for _, rt := range m.ResponseTimes {
			total += rt
		}
		avgResponseTime = total / time.Duration(len(m.ResponseTimes))
	}

	metricsData := map[string]interface{}{
		"requests_total":      m.RequestCount,
		"errors_total":        m.ErrorCount,
		"avg_response_time":   avgResponseTime.Milliseconds(),
		"active_users":        len(m.ResponseTimes), // Approximation
		"iss_requests":        m.ISSRequests,
		"nasa_requests":       m.NASARequests,
		"game_sessions":       m.GameSessions,
		"uptime":             time.Since(startTime).Seconds(),
	}
	m.Mutex.RUnlock()

	response := models.APIResponse{
		Success: true,
		Data:    metricsData,
		Message: "Metrics retrieved successfully",
	}

	json.NewEncoder(w).Encode(response)
}

var startTime = time.Now()