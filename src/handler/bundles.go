package handler

import "github.com/gin-gonic/gin"

func GetBundles(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello World!",
	})
}
