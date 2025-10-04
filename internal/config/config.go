package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port           string
	NASAAPIKey     string
	ISSAPIURL      string
	CacheTimeout   time.Duration
	RequestTimeout time.Duration
}

func Load() *Config {
	cacheTimeout, _ := strconv.Atoi(getEnv("CACHE_TIMEOUT", "300"))
	requestTimeout, _ := strconv.Atoi(getEnv("REQUEST_TIMEOUT", "10"))

	return &Config{
		Port:           getEnv("PORT", "8080"),
		NASAAPIKey:     getEnv("NASA_API_KEY", ""),
		ISSAPIURL:      getEnv("ISS_API_URL", "http://api.open-notify.org/iss-now.json"),
		CacheTimeout:   time.Duration(cacheTimeout) * time.Second,
		RequestTimeout: time.Duration(requestTimeout) * time.Second,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}