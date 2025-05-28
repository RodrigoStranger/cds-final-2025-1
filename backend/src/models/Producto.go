package models

import (
	"database/sql"
	"log"
)

// Devuelve todos los productos de la base de datos
func ObtenerTodosProductos(db *sql.DB) (*sql.Rows, error) {
	query := "SELECT * FROM Productos"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Error al ejecutar la consulta: %v", err)
		return nil, err
	}
	return rows, nil
}
