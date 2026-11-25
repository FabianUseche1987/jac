
// =============================================================
// reunion.repository.js - Capa de acceso a datos
// Contiene SOLO las consultas SQL a las tablas reuniones
// y asistencias_reunion de MySQL.
// =============================================================

const pool = require('../config/db');

// -------------------------------------------------------------
// REUNIONES
// -------------------------------------------------------------

// Trae todas las reuniones, ordenadas por fecha e id descendente
async function listar() {
  const [filas] = await pool.query(
    'SELECT * FROM reuniones ORDER BY fecha DESC, id DESC'
  );
  return filas;
}

// Busca una reunión por su id
async function buscarPorId(id) {
  const [filas] = await pool.query(
    'SELECT * FROM reuniones WHERE id = ?',
    [id]
  );
  return filas[0];
}

// Inserta una reunión nueva y devuelve el id generado
async function crear(reunion) {
  const [resultado] = await pool.query(
    `INSERT INTO reuniones
      (titulo, descripcion, tipo, fecha, hora, lugar, estado, junta_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reunion.titulo,
      reunion.descripcion,
      reunion.tipo,
      reunion.fecha,
      reunion.hora,
      reunion.lugar,
      reunion.estado,
      reunion.junta_id || 1
    ]
  );

  return resultado.insertId;
}

// Actualiza una reunión existente
async function actualizar(id, reunion) {
  const [resultado] = await pool.query(
    `UPDATE reuniones
     SET titulo = ?, descripcion = ?, tipo = ?,
         fecha = ?, hora = ?, lugar = ?,
         estado = ?, junta_id = ?
     WHERE id = ?`,
    [
      reunion.titulo,
      reunion.descripcion,
      reunion.tipo,
      reunion.fecha,
      reunion.hora,
      reunion.lugar,
      reunion.estado,
      reunion.junta_id || 1,
      id
    ]
  );

  return resultado.affectedRows;
}

// Cambia el estado de una reunión
async function cambiarEstado(id, estado) {
  const [resultado] = await pool.query(
    'UPDATE reuniones SET estado = ? WHERE id = ?',
    [estado, id]
  );

  return resultado.affectedRows;
}

// Elimina una reunión por su id
async function eliminar(id) {
  const [resultado] = await pool.query(
    'DELETE FROM reuniones WHERE id = ?',
    [id]
  );

  return resultado.affectedRows;
}

// -------------------------------------------------------------
// ASISTENCIA A REUNIONES
// -------------------------------------------------------------

// Trae los asistentes de una reunión con sus datos de usuario
async function listarAsistentes(reunionId) {
  const [filas] = await pool.query(
    `SELECT
       a.id,
       a.reunion_id,
       a.usuario_id,
       u.nombres,
       u.apellidos,
       u.numero_documento,
       u.correo,
       a.estado_asistencia,
       a.observacion,
       a.fecha_registro
     FROM asistencias_reunion a
     INNER JOIN usuarios u ON a.usuario_id = u.id
     WHERE a.reunion_id = ?
     ORDER BY u.nombres ASC`,
    [reunionId]
  );

  return filas;
}

// Registra un usuario como asistente de una reunión
async function registrarAsistencia(asistencia) {
  const [resultado] = await pool.query(
    `INSERT INTO asistencias_reunion
      (reunion_id, usuario_id, estado_asistencia, observacion)
     VALUES (?, ?, ?, ?)`,
    [
      asistencia.reunion_id,
      asistencia.usuario_id,
      asistencia.estado_asistencia,
      asistencia.observacion
    ]
  );

  return resultado.insertId;
}

// Actualiza el estado y la observación de una asistencia
async function actualizarAsistencia(id, asistencia) {
  const [resultado] = await pool.query(
    `UPDATE asistencias_reunion
     SET estado_asistencia = ?, observacion = ?
     WHERE id = ?`,
    [
      asistencia.estado_asistencia,
      asistencia.observacion,
      id
    ]
  );

  return resultado.affectedRows;
}

// Elimina un registro de asistencia
async function eliminarAsistencia(id) {
  const [resultado] = await pool.query(
    'DELETE FROM asistencias_reunion WHERE id = ?',
    [id]
  );

  return resultado.affectedRows;
}

// -------------------------------------------------------------
// EXPORTACIÓN DE FUNCIONES
// -------------------------------------------------------------

module.exports = {
  listar,
  buscarPorId,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
  listarAsistentes,
  registrarAsistencia,
  actualizarAsistencia,
  eliminarAsistencia
};
