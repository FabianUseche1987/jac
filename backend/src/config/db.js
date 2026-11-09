// =============================================================
// db.js - Conexión a la base de datos MySQL (Hostinger)
// Crea un "pool" de conexiones que reutilizan todos los repositorios.
// =============================================================

// Carga las variables del archivo .env en process.env (función nativa de Node 24)
process.loadEnvFile();

const mysql = require('mysql2/promise');

// Un pool mantiene varias conexiones abiertas y las presta a cada consulta,
// así no hay que conectarse y desconectarse en cada petición.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // si todas están ocupadas, espera en lugar de fallar
  connectionLimit: 10       // máximo 10 conexiones simultáneas
});

module.exports = pool;
