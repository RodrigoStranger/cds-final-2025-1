const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
const productoRoutes = require('./src/routes/ProductoRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', productoRoutes);

// Iniciar el servidor
app.listen(4000, () => {
  console.log(`Servidor corriendo en http://localhost:4000`);
});