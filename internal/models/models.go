package models

import "time"

// ISSPosition represents the current ISS location
type ISSPosition struct {
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Altitude  float64   `json:"altitude"`
	Velocity  float64   `json:"velocity"`
	Timestamp time.Time `json:"timestamp"`
}

// NASAImage represents NASA Earth imagery data
type NASAImage struct {
	URL         string    `json:"url"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Location    Location  `json:"location,omitempty"`
}

// Location represents geographical coordinates
type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// NBLScore represents game simulation results
type NBLScore struct {
	PlayerID    string    `json:"player_id"`
	Score       int       `json:"score"`
	TimeElapsed int       `json:"time_elapsed"`
	Completed   bool      `json:"completed"`
	Timestamp   time.Time `json:"timestamp"`
}

// APIResponse represents standard API response format
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}