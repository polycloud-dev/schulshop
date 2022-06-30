package main

import (
	"os"

	"github.com/gin-contrib/cors"

	"github.com/gin-contrib/static"

	"github.com/gin-gonic/gin"

	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load()

	// get env var "MODE"
	mode := os.Getenv("MODE")

	// if mode is "release"
	if mode == "release" {
		// set gin mode to release
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// dont trust proxies
	r.SetTrustedProxies([]string{})

	// cors
	r.Use(cors.Default())

	// serve react app
	r.Use(static.Serve("/", static.LocalFile("./app/build", true)))

	// serve routes
	for _, route := range routes {
		r.Handle(route.method, route.path, route.handler)
	}

	r.Run(":80")
}
