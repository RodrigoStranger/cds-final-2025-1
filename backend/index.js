const express = require('express');
const cors = require('cors');

// Configuración de variables de entorno
require('dotenv').config({ path: '.env.local' });

// Rutas
const productoRoutes = require('./src/routes/ProductoRoute');
const lineaRoutes = require('./src/routes/LineaRoute');
const categoriaRoutes = require('./src/routes/CategoriaRoute');
const proveedorRoutes = require('./src/routes/ProveedorRoute');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173' , // URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/lineas', lineaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});