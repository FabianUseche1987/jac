// =============================================================
// predio.repository.js - Capa de acceso a datos
// Contiene SOLO las consultas SQL a la tabla predios de MySQL.
// =============================================================
const pool = require('../config/db');

async function listar() {
  const [filas] = await pool.query('SELECT * FROM predios ORDER BY id DESC');
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.query('SELECT * FROM predios WHERE id = ?', [id]);
  return filas[0];
}

async function crear(predio) {
  const [resultado] = await pool.query(
    `INSERT INTO predios (direccion, barrio, matricula_inmobiliaria, estrato, tipo_predio, propietario, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      predio.direccion,
      predio.barrio,
      predio.matricula_inmobiliaria,
      predio.estrato,
      predio.tipo_predio,
      predio.propietario,
      predio.estado
    ]
  );
  return resultado.insertId;
}

async function actualizar(id, predio) {
  const [resultado] = await pool.query(
    `UPDATE predios
     SET direccion = ?, barrio = ?, matricula_inmobiliaria = ?, estrato = ?,
         tipo_predio = ?, propietario = ?, estado = ?
     WHERE id = ?`,
    [
      predio.direccion,
      predio.barrio,
      predio.matricula_inmobiliaria,
      predio.estrato,
      predio.tipo_predio,
      predio.propietario,
      predio.estado,
      id
    ]
  );
  return resultado.affectedRows;
}

async function cambiarEstado(id, estado) {
  const [resultado] = await pool.query(
    'UPDATE predios SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return resultado.affectedRows;
}

async function eliminar(id) {
  const [resultado] = await pool.query(
    'DELETE FROM predios WHERE id = ?',
    [id]
  );
  return resultado.affectedRows;
}

module.exports = { listar, buscarPorId, crear, actualizar, cambiarEstado, eliminar };
