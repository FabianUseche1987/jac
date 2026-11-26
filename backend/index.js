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
const predioRoutes = require('./src/routes/predio.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/reuniones', reunionRoutes);
app.use('/api/predios', predioRoutes);

app.get('/', (req, res) => {
  res.send('API de JAC Connect funcionando');
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
