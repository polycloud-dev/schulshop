package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	// get env var "MODE"
	mode := os.Getenv("MODE")

	// if mode is "release"
	if mode == "release" {
		// set gin mode to release
		gin.SetMode(gin.ReleaseMode)
	}

	// serve react app
	r := gin.New()

	// dont trust proxies
	r.SetTrustedProxies([]string{})

	r.Static("/", "./app/build")
	r.Run(":3000")
}
