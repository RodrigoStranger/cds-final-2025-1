const express = require('express');
const cors = require('cors');

// Configuración de variables de entorno
require('dotenv').config({ path: '.env.local' });

// Base de datos
const database = require('./src/config/Database');

// Middleware de autenticación
const { verificarToken } = require('./src/middleware/authMiddleware');

// Rutas
const productoRoutes = require('./src/routes/ProductoRoute');
const lineaRoutes = require('./src/routes/LineaRoute');
const categoriaRoutes = require('./src/routes/CategoriaRoute');
const proveedorRoutes = require('./src/routes/ProveedorRoute');

const app = express();

// Configuración de CORS (temporalmente permitiendo todos los orígenes para pruebas)
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

// Rutas de la API (protegidas con autenticación)
app.use('/api/productos', verificarToken, productoRoutes);
app.use('/api/lineas', verificarToken, lineaRoutes);
app.use('/api/categorias', verificarToken, categoriaRoutes);
app.use('/api/proveedores', verificarToken, proveedorRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

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
  console.log(`🚀 Servidor listo en el puerto: ${PORT}`);
  console.log('📊 Estado de la base de datos:');
  console.log(`   ${dbStatus.message}`);
  if (!dbStatus.connected) {
    console.log(`   Error: ${dbStatus.error}`);
  }
  console.log('='.repeat(60));
  console.log('� Endpoints protegidos (requieren token JWT):');
  console.log(`   - GET  /api/health        Verificar estado del servidor (público)`);
  console.log(`   - GET  /api/productos     Obtener productos (protegido)`);
  console.log(`   - GET  /api/lineas        Obtener líneas (protegido)`);
  console.log(`   - GET  /api/categorias    Obtener categorías (protegido)`);
  console.log(`   - GET  /api/proveedores   Obtener proveedores (protegido)`);
  console.log('');
  console.log('🔑 Para acceder a las rutas protegidas:');
  console.log('   1. Hacer login en: http://localhost:3001/api/auth/login');
  console.log('   2. Usar el token en el header: Authorization: Bearer [token]');
  console.log('='.repeat(60));
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});