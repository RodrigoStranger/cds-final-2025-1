package controllers // Paquete para los controladores

import (
	"database/sql" // Paquete para manejar la base de datos
	"log"          // Paquete para manejar los logs
	"net/http"     // Paquete para manejar las peticiones HTTP
	"strings"      // Paquete para manipulación de cadenas

	"backend/src/models" // Paquete para los modelos

	"github.com/gin-gonic/gin" // Paquete para manejar las rutas
)

// Estructura para el cuerpo de la petición de creación de producto
type ProductoRequest struct {
	Nombre       string  `json:"nombre" binding:"required"`                 // Nombre del producto
	Descripcion  *string `json:"descripcion,omitempty"`                     // Descripción del producto
	PrecioCompra float64 `json:"precio_compra" binding:"required,gt=0"`     // Precio de compra del producto
	PrecioVenta  float64 `json:"precio_venta" binding:"required,gt=0"`      // Precio de venta del producto
	Stock        *int    `json:"stock,omitempty" binding:"omitempty,gte=0"` // Stock del producto
	CodCategoria *int    `json:"cod_categoria,omitempty"`                   // Categoría del producto
	CodLinea     *int    `json:"cod_linea,omitempty"`                       // Línea del producto
}

// CrearProducto maneja la solicitud POST para crear un nuevo producto
func CrearProducto(c *gin.Context) {
	// Obtener la conexión a la base de datos
	db, ok := c.MustGet("db").(*sql.DB)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al conectar con la base de datos"})
		return
	}

	// Validar y parsear el cuerpo de la petición
	var productoReq ProductoRequest
	if err := c.ShouldBindJSON(&productoReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de producto inválidos: " + err.Error()})
		return
	}

	// Establecer stock en 0 si no se proporciona
	stock := 0
	if productoReq.Stock != nil {
		stock = *productoReq.Stock // Asignar el valor del puntero
	}

	// Llamar al modelo para crear el producto
	mensaje, err := models.AgregarProducto(
		db,
		productoReq.Nombre,       // Nombre del producto
		productoReq.Descripcion,  // Descripción del producto
		productoReq.PrecioCompra, // Precio de compra del producto
		productoReq.PrecioVenta,  // Precio de venta del producto
		stock,                    // Stock del producto
		productoReq.CodCategoria, // Puede ser nil
		productoReq.CodLinea,     // Puede ser nil
	)

	if err != nil {
		log.Printf("Error al crear producto: %v", err)
		// Extraer solo el mensaje de error después del último ":"
		errMsg := err.Error() // Obtener el mensaje de error
		if lastColon := strings.LastIndex(errMsg, ": "); lastColon != -1 {
			errMsg = strings.TrimSpace(errMsg[lastColon+2:]) // Extraer el mensaje de error
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": errMsg}) // Devolver error
		return                                                         // Retornar error
	}

	// Devolver respuesta exitosa
	c.JSON(http.StatusCreated, gin.H{"mensaje": mensaje}) // Devolver respuesta exitosa
}
