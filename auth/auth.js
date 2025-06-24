const express = require('express');
const cors = require('cors');

// Configuración de variables de entorno
require('dotenv').config();

// Base de datos
const database = require('./src/config/database');

// Rutas
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'https://fabianatura.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log para depuración
console.log('Configuración CORS:', {
  origin: corsOptions.origin,
  methods: corsOptions.methods,
  allowedHeaders: corsOptions.allowedHeaders
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Ruta de verificación de salud de la base de datos
app.get('/api/health', async (req, res) => {
  try {
    const connection = await database.pool.getConnection();
    await connection.ping();
    connection.release();
    res.status(200).json({ 
      status: 'OK',
      database: 'Conectado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ 
      status: 'Error',
      database: 'Error de conexión',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection() {
  try {
    const connection = await database.pool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: '✅ Conectado a la base de datos' };
  } catch (error) {
    return { 
      connected: false, 
      message: '❌ Error de conexión a la base de datos',
      error: error.message 
    };
  }
}

// Iniciar el servidor
const server = app.listen(PORT, async () => {
  const dbStatus = await checkDatabaseConnection();
  console.log('='.repeat(60));
  console.log(`🔐 Servidor de Autenticación listo en el puerto: ${PORT}`);
  console.log('📊 Estado de la base de datos:');
  console.log(`   ${dbStatus.message}`);
  if (!dbStatus.connected) {
    console.log(`   Error: ${dbStatus.error}`);
  }
  console.log('='.repeat(60));
  console.log('🔑 Endpoints de autenticación disponibles:');
  console.log(`   - GET  /api/health        Verificar estado del servidor`);
  console.log(`   - POST /api/auth/login    Iniciar sesión`);
  console.log(`   - POST /api/auth/verify   Verificar token`);
  console.log(`   - GET  /api/auth/profile  Obtener perfil del empleado`);
  console.log('='.repeat(60));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});
