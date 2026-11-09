// =============================================================
// usuario.repository.js - Capa de acceso a datos
// Contiene SOLO las consultas SQL a la tabla usuarios.
// =============================================================
const pool = require('../config/db');

// Trae todos los usuarios, ordenados por id
async function listar() {
  const [filas] = await pool.query('SELECT * FROM usuarios ORDER BY id');
  return filas;
}

// Trae un usuario por su id (devuelve undefined si no existe)
async function buscarPorId(id) {
  const [filas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return filas[0];
}

// Inserta un usuario nuevo y devuelve el id que le asignó MySQL
async function crear(usuario) {
  const [resultado] = await pool.query(
    `INSERT INTO usuarios (nombres, apellidos, tipo_documento, numero_documento, correo, celular, rol)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [usuario.nombres, usuario.apellidos, usuario.tipo_documento, usuario.numero_documento,
     usuario.correo, usuario.celular, usuario.rol]
  );
  return resultado.insertId;
}

// Actualiza un usuario. Devuelve cuántas filas encontró (0 = no existe)
async function actualizar(id, usuario) {
  const [resultado] = await pool.query(
    `UPDATE usuarios
     SET nombres = ?, apellidos = ?, tipo_documento = ?, numero_documento = ?,
         correo = ?, celular = ?, rol = ?
     WHERE id = ?`,
    [usuario.nombres, usuario.apellidos, usuario.tipo_documento, usuario.numero_documento,
     usuario.correo, usuario.celular, usuario.rol, id]
  );
  return resultado.affectedRows;
}

// Activa o desactiva un usuario (no se borra, para conservar su historial)
async function cambiarEstado(id, estado) {
  const [resultado] = await pool.query(
    'UPDATE usuarios SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return resultado.affectedRows;
}

module.exports = { listar, buscarPorId, crear, actualizar, cambiarEstado };
