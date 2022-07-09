package handler

import (
	"encoding/json"
	"regexp"

	"io/ioutil"

	"hash/fnv"
	"os"

	"math/rand"

	"github.com/gin-gonic/gin"
)

type Product struct {
	Id       string `json:"id"`
	Quantity int    `json:"quantity"`
}

type Order struct {
	Id          int
	Name        string    `json:"name"`
	SchoolClass string    `json:"school_class"`
	Email       string    `json:"email"`
	Products    []Product `json:"products"`
	CustomerId  uint32
}

func hash(s string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}

func PostOrder(c *gin.Context) {
	// get json data from request
	var order Order

	if err := c.BindJSON(&order); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// validate data
	r_name, _ := regexp.Compile(`^[a-zA-ZäöüÄÖÜß]+\s[a-zA-ZäöüÄÖÜß]+`)
	if !r_name.MatchString(order.Name) {
		c.JSON(400, gin.H{"error": "Invalid name"})
		return
	}

	r_school_class, _ := regexp.Compile(`^[1-9][0-3]?[a-z]$`)
	if !r_school_class.MatchString(order.SchoolClass) {
		c.JSON(400, gin.H{"error": "Invalid school class"})
		return
	}

	r_email, _ := regexp.Compile(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`)
	if order.Email != "" && !r_email.MatchString(order.Email) {
		c.JSON(400, gin.H{"error": "Invalid email"})
		return
	}

	// open data file
	productFile, err := os.Open("./data/products.json")
	if err != nil {
		panic("Could not open data files")
	}
	defer productFile.Close()
	productValue, _ := ioutil.ReadAll(productFile)

	var productData map[string]interface{}
	json.Unmarshal([]byte(productValue), &productData)

	for _, product := range order.Products {
		if product.Id == "" || product.Quantity <= 0 {
			c.JSON(400, gin.H{"error": "Invalid product"})
			return
		}
		if productData[product.Id] == nil {
			c.JSON(400, gin.H{"error": "Invalid product"})
			return
		}
	}

	// generate customer id
	ip := c.ClientIP()
	agent := c.Request.Header.Get("User-Agent")
	order.CustomerId = hash(ip + agent)

	// generate order id
	// TODO: better way to generate order id
	order.Id = rand.Intn(100000)

	out, err := json.Marshal(order)
	if err != nil {
		panic(err)
	}
	println("Order:", string(out))

	c.JSON(200, gin.H{"success": "Order received", "order_id": order.Id})
}
