package main

import (
	"server/handler"

	"github.com/gin-gonic/gin"
)

type Route struct {
	method  string
	path    string
	handler func(c *gin.Context)
}

var routes = []Route{
	{"GET", "/api/bundles", handler.GetBundles},
}
