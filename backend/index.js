const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
const productoRoutes = require('./src/routes/ProductoRoute');
const lineaRoutes = require('./src/routes/LineaRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/lineas', lineaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});