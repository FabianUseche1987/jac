// =============================================================
// proyecto.repository.js - Capa de acceso a datos
// Contiene SOLO las consultas SQL a la tabla proyectos de MySQL.
// =============================================================
const pool = require('../config/db');

// Trae todos los proyectos, ordenados por id descendente
async function listar() {
  const [filas] = await pool.query('SELECT * FROM proyectos ORDER BY id DESC');
  return filas;
}

// Trae un proyecto por su id (devuelve undefined si no existe)
async function buscarPorId(id) {
  const [filas] = await pool.query('SELECT * FROM proyectos WHERE id = ?', [id]);
  return filas[0];
}

// Inserta un proyecto nuevo en MySQL y devuelve el id generado
async function crear(proyecto) {
  const [resultado] = await pool.query(
    `INSERT INTO proyectos (titulo, descripcion, presupuesto, fecha_inicio, fecha_fin, estado, junta_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      proyecto.titulo,
      proyecto.descripcion,
      proyecto.presupuesto,
      proyecto.fecha_inicio,
      proyecto.fecha_fin,
      proyecto.estado,
      proyecto.junta_id || 1
    ]
  );
  return resultado.insertId;
}

// Actualiza un proyecto existente. Devuelve cuántas filas fueron modificadas
async function actualizar(id, proyecto) {
  const [resultado] = await pool.query(
    `UPDATE proyectos
     SET titulo = ?, descripcion = ?, presupuesto = ?, fecha_inicio = ?, fecha_fin = ?,
         estado = ?, junta_id = ?
     WHERE id = ?`,
    [
      proyecto.titulo,
      proyecto.descripcion,
      proyecto.presupuesto,
      proyecto.fecha_inicio,
      proyecto.fecha_fin,
      proyecto.estado,
      proyecto.junta_id || 1,
      id
    ]
  );
  return resultado.affectedRows;
}

// Cambia solo el estado de un proyecto ('propuesto', 'en ejecucion', 'finalizado', 'cancelado')
async function cambiarEstado(id, estado) {
  const [resultado] = await pool.query(
    'UPDATE proyectos SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return resultado.affectedRows;
}

// Elimina un proyecto por su id
async function eliminar(id) {
  const [resultado] = await pool.query(
    'DELETE FROM proyectos WHERE id = ?',
    [id]
  );
  return resultado.affectedRows;
}

module.exports = { listar, buscarPorId, crear, actualizar, cambiarEstado, eliminar };
