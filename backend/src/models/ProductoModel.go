package models // Paquete para los modelos

import (
	"database/sql" // Paquete para manejar la base de datos
	"log"          // Paquete para manejar los logs
)

// Devuelve todos los productos de la base de datos
func ObtenerTodosProductos(db *sql.DB) (*sql.Rows, error) {
	query := "SELECT * FROM Productos" // Consulta SQL
	rows, err := db.Query(query)       // Ejecutar la consulta
	if err != nil {
		log.Printf("Error al ejecutar la consulta: %v", err) // Imprimir error
		return nil, err                                      // Retornar error
	}
	return rows, nil // Retornar los resultados
}
