// =============================================================
// index.js - Punto de entrada del backend de JAC Connect
// =============================================================
process.loadEnvFile(); // carga las variables del archivo .env

const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./src/routes/usuario.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares: se ejecutan antes de cada ruta
app.use(cors());         // permite que Angular (puerto 4200) consuma esta API
app.use(express.json()); // convierte el JSON que llega en un objeto (req.body)
app.use('/api/usuarios', usuarioRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de JAC Connect funcionando');
});

// Arranca el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
