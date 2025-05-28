package main // Paquete principal

import (
	"log"      // Paquete para manejar los logs
	"net/http" // Paquete para manejar las peticiones HTTP
	"time"     // Paquete para manejar fechas y tiempos

	"backend/src/config" // Paquete para la configuración de la base de datos
	"backend/src/routes" // Paquete para las rutas

	"github.com/gin-gonic/gin" // Paquete para manejar las rutas
)

func main() {
	// Configurar Gin
	gin.SetMode(gin.ReleaseMode) // Configurar el modo de Gin
	router := gin.Default()      // Configurar el router

	// Configurar rutas
	setupRoutes(router) // Configurar las rutas

	// Iniciar el servidor
	server := &http.Server{
		Addr:         ":8080",          // Dirección del servidor
		Handler:      router,           // Manejador de rutas
		ReadTimeout:  10 * time.Second, // Tiempo de lectura
		WriteTimeout: 10 * time.Second, // Tiempo de escritura
	}

	// Iniciar el servidor
	log.Println("Servidor iniciado en http://localhost:8080") // Imprimir mensaje de inicio
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Error al iniciar el servidor: %v", err) // Imprimir error
	}
}

// setupRoutes configura las rutas
func setupRoutes(router *gin.Engine) {
	// Conectar a la base de datos
	config.ConnectDB()       // Conectar a la base de datos
	gormDB := config.GetDB() // Obtener la instancia de la base de datos
	if gormDB == nil {
		log.Fatal("No se pudo conectar a la base de datos") // Imprimir error
	}

	// Obtener la conexión SQL subyacente
	sqlDB, err := gormDB.DB() // Obtener la conexión SQL subyacente
	if err != nil {
		log.Fatalf("Error al obtener la conexión SQL: %v", err) // Imprimir error
	}

	// Configurar el pool de conexiones
	sqlDB.SetMaxIdleConns(10)           // Configurar el pool de conexiones
	sqlDB.SetMaxOpenConns(100)          // Configurar el pool de conexiones
	sqlDB.SetConnMaxLifetime(time.Hour) // Configurar el pool de conexiones

	// Configurar rutas
	routes.SetupProductoRoutes(router, sqlDB) // Configurar rutas

	// Ruta de bienvenida
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"mensaje": "¡Bienvenido a la API de Fabia Natura!", // Mensaje de bienvenida
		})
	})

	// Ruta de verificación de salud
	router.GET("/health", func(c *gin.Context) {
		if err := sqlDB.Ping(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"estado":  "error",                                                // Estado de error
				"mensaje": "Error al conectar a la base de datos: " + err.Error(), // Mensaje de error
			})
			return // Retornar error
		}
		c.JSON(http.StatusOK, gin.H{
			"estado":  "ok",                            // Estado de error
			"mensaje": "API funcionando correctamente", // Mensaje de bienvenida
		})
	})
}
