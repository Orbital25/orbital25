package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"orbital25/internal/handlers"
	"orbital25/internal/middleware"
)

func main() {
	mux := http.NewServeMux()

	// Static files
	fs := http.FileServer(http.Dir("./static/"))
	mux.Handle("/", fs)

	// API routes with middleware
	api := http.NewServeMux()
	api.HandleFunc("/iss", handlers.ISSHandler)
	api.HandleFunc("/nasa", handlers.NASAHandler)
	api.HandleFunc("/nbl", handlers.NBLHandler)

	mux.Handle("/api/", http.StripPrefix("/api", middleware.CORS(middleware.Logger(api))))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Orbitra server starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ Server exited")
}