const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

// Crear y exportar una instancia única de la base de datos
const database = new Database();

module.exports = database;