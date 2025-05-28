package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"backend/src/models"
)

// ObtenerProductos maneja la solicitud GET para obtener todos los productos
func ObtenerProductos(c *gin.Context) {
	// Obtener la conexión a la base de datos
	db, ok := c.MustGet("db").(*sql.DB)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al conectar con la base de datos"})
		return
	}

	// Obtener los productos
	rows, err := models.ObtenerTodosProductos(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener los productos"})
		return
	}
	defer rows.Close()

	// Obtener los nombres de las columnas
	columns, err := rows.Columns()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las columnas"})
		return
	}

	// Preparar los slices para los valores
	count := len(columns)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)

	var productos []map[string]interface{}

	for rows.Next() {
		// Preparar los punteros para los valores
		for i := range columns {
			valuePtrs[i] = &values[i]
		}

		// Escanear los valores en los punteros
		if err := rows.Scan(valuePtrs...); err != nil {
			log.Printf("Error al escanear fila: %v", err)
			continue
		}

		// Crear un mapa para la fila actual
		producto := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				producto[col] = string(b)
			} else {
				producto[col] = val
			}
		}
		productos = append(productos, producto)
	}

	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar los resultados"})
		return
	}

	c.JSON(http.StatusOK, productos)
}
