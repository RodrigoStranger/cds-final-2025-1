package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"backend/src/controllers"
)

// SetupProductoRoutes configura las rutas para los productos
func SetupProductoRoutes(router *gin.Engine, db *sql.DB) {
	// Middleware para inyectar la conexión a la base de datos
	router.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Grupo de rutas para la API de productos
	api := router.Group("/api")
	{
		// Obtener todos los productos
		api.GET("/productos", controllers.ObtenerProductos)
	}
}
