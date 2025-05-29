package models // Paquete para los modelos

import (
	"database/sql" // Paquete para manejar la base de datos
)

// AgregarProducto llama al procedimiento almacenado para agregar un nuevo producto
func AgregarProducto(db *sql.DB, nombre string, descripcion *string, precioCompra float64, precioVenta float64, stock int, codCategoria *int, codLinea *int) (string, error) {
	// Llamar al procedimiento almacenado
	_, err := db.Exec("CALL AgregarProducto(?, ?, ?, ?, ?, ?, ?)", // Llamar al procedimiento almacenado
		nombre,       // Nombre del producto
		descripcion,  // Descripción del producto
		precioCompra, // Precio de compra del producto
		precioVenta,  // Precio de venta del producto
		stock,        // Stock del producto
		codCategoria, // Categoría del producto
		codLinea,     // Línea del producto
	)

	if err != nil {
		return "", err // Retornar error
	}

	return "Producto agregado exitosamente", nil // Retornar mensaje de éxito
}
