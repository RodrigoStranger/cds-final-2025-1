package config // Paquete para la configuración de la base de datos

// Importar paquetes
import (
	"fmt"  // Paquete para manejar la salida de texto
	"log"  // Paquete para manejar los logs
	"os"   // Paquete para manejar variables de entorno
	"time" // Paquete para manejar fechas y tiempos

	"github.com/joho/godotenv" // Paquete para cargar variables de entorno
	"gorm.io/driver/mysql"     // Driver para MySQL
	"gorm.io/gorm"             // ORM para Go
)

var DB *gorm.DB // Variable global para almacenar la conexión a la base de datos

func ConnectDB() {
	// Cargar variables de entorno desde el archivo .env
	err := godotenv.Load("../.env.local")
	if err != nil {
		log.Fatalf("Error .env file: %v", err)
	}

	// Obtener la configuración de la base de datos desde las variables de entorno
	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")
	dbHost := os.Getenv("MYSQL_HOST")
	dbPort := os.Getenv("MYSQL_PORT")
	dbName := os.Getenv("MYSQL_DATABASE")

	// Crear la cadena de conexión
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	// Abrir una conexión a la base de datos
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Error al conectar a la base de datos: %v", err)
		log.Printf("DSN usado: %s", dsn)
		return
	}

	// Configurar el pool de conexiones (opcional)
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Error al obtener la instancia de la base de datos: %v", err)
	}

	// Configurar el pool de conexiones (opcional)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Asignar la conexión a la variable global
	DB = db

	log.Println("Conexión exitosa a la base de datos!")
}

// GetDB retorna una instancia de la base de datos
func GetDB() *gorm.DB {
	return DB
}
