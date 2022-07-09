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
	{"GET", "/api/classbundles", handler.GetClassBundles},
	{"GET", "/api/products", handler.GetProducts},
	{"GET", "/image/:id", handler.GetImage},
	{"POST", "/api/order", handler.PostOrder},
}
