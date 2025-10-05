package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"orbital25/internal/handlers"
	"orbital25/internal/middleware"
)

func main() {
	mux := http.NewServeMux()

	// API routes with middleware
	api := http.NewServeMux()
	api.HandleFunc("/iss", handlers.ISSHandler)
	api.HandleFunc("/nasa", handlers.NASAHandler)
	api.HandleFunc("/nbl", handlers.NBLHandler)
	mux.Handle("/api/", http.StripPrefix("/api", middleware.CORS(middleware.Logger(api))))

	// Serve Next.js static export
	// The Next.js build output will be in next-app/out after running `npm run build`
	nextBuildDir := "./next-app/out"
	
	// Check if build directory exists
	if _, err := os.Stat(nextBuildDir); os.IsNotExist(err) {
		log.Printf("⚠️  Warning: Next.js build directory not found at %s", nextBuildDir)
		log.Printf("    Run 'cd next-app && npm run build' to generate static files")
	}

	// Create a custom file server that handles Next.js routing
	fileServer := http.FileServer(http.Dir(nextBuildDir))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Get the absolute path to prevent directory traversal attacks
		path := filepath.Join(nextBuildDir, r.URL.Path)
		
		// Check if the path exists
		_, err := os.Stat(path)
		
		// If it's a directory or doesn't exist, try serving index.html
		if os.IsNotExist(err) || (err == nil && isDirectory(path)) {
			// For client-side routing, serve index.html for non-existent routes
			// unless it's an API call or static asset
			if !isStaticAsset(r.URL.Path) && r.URL.Path != "/" {
				indexPath := filepath.Join(nextBuildDir, r.URL.Path, "index.html")
				if _, err := os.Stat(indexPath); err == nil {
					http.ServeFile(w, r, indexPath)
					return
				}
				// Fallback to root index.html for client-side routing
				http.ServeFile(w, r, filepath.Join(nextBuildDir, "index.html"))
				return
			}
		}
		
		// Serve the file normally
		fileServer.ServeHTTP(w, r)
	})

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
		log.Printf("📁 Serving Next.js app from: %s", nextBuildDir)
		log.Printf("🔗 API endpoints available at: /api/*")
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

// isDirectory checks if a path is a directory
func isDirectory(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}

// isStaticAsset checks if the path is for a static asset
func isStaticAsset(path string) bool {
	staticExtensions := []string{".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".json", ".xml", ".txt"}
	ext := filepath.Ext(path)
	for _, staticExt := range staticExtensions {
		if ext == staticExt {
			return true
		}
	}
	return false
}