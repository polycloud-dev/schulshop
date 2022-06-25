package handler

import "github.com/gin-gonic/gin"

func GetBundles(c *gin.Context) {
	c.File("data/bundles.json")
}

func GetClassBundles(c *gin.Context) {
	c.File("data/class_bundles.json")
}

func GetProducts(c *gin.Context) {
	c.File("data/products.json")
}
