package metrics

import (
	"sync"
	"time"
)

type Metrics struct {
	RequestCount    int64
	ErrorCount      int64
	ResponseTimes   []time.Duration
	ActiveUsers     int64
	ISSRequests     int64
	NASARequests    int64
	GameSessions    int64
	Mutex           sync.RWMutex
}

var globalMetrics = &Metrics{}

func GetMetrics() *Metrics {
	return globalMetrics
}

func IncrementRequests() {
	globalMetrics.Mutex.Lock()
	globalMetrics.RequestCount++
	globalMetrics.Mutex.Unlock()
}

func IncrementErrors() {
	globalMetrics.Mutex.Lock()
	globalMetrics.ErrorCount++
	globalMetrics.Mutex.Unlock()
}

func RecordResponseTime(duration time.Duration) {
	globalMetrics.Mutex.Lock()
	globalMetrics.ResponseTimes = append(globalMetrics.ResponseTimes, duration)
	if len(globalMetrics.ResponseTimes) > 1000 {
		globalMetrics.ResponseTimes = globalMetrics.ResponseTimes[1:]
	}
	globalMetrics.Mutex.Unlock()
}

func IncrementISSRequests() {
	globalMetrics.Mutex.Lock()
	globalMetrics.ISSRequests++
	globalMetrics.Mutex.Unlock()
}

func IncrementNASARequests() {
	globalMetrics.Mutex.Lock()
	globalMetrics.NASARequests++
	globalMetrics.Mutex.Unlock()
}

func IncrementGameSessions() {
	globalMetrics.Mutex.Lock()
	globalMetrics.GameSessions++
	globalMetrics.Mutex.Unlock()
}