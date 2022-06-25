package handler

import (
	"github.com/gin-gonic/gin"
)

func GetImage(c *gin.Context) {
	id := c.Param("id")
	c.File("images/" + id)
}
