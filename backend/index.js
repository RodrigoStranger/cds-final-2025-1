const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 1
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API REST funcionando correctamente');
});

// Ruta para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      database: process.env.MYSQL_DATABASE
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al conectar a la base de datos',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Verifica la conexión a la base de datos en: http://localhost:${PORT}/test-db`);
});