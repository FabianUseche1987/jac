// =============================================================
// index.js - Punto de entrada del backend de JAC Connect
// =============================================================
const path = require('path');
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch {
  try {
    process.loadEnvFile();
  } catch {}
}

const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./src/routes/usuario.routes');
const proyectoRoutes = require('./src/routes/proyecto.routes');
const reunionRoutes = require('./src/routes/reunion.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares: se ejecutan antes de cada ruta
app.use(cors());         // permite que Angular (puerto 4200) consuma esta API
app.use(express.json()); // convierte el JSON que llega en un objeto (req.body)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/reuniones', reunionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de JAC Connect funcionando');
});

// Arranca el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
