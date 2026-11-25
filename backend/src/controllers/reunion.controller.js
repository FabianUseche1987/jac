
 // =============================================================
 // reunion.controller.js - Capa de control
 // Recibe las peticiones HTTP y responde en JSON.
 // =============================================================

const reunionService = require('../services/reunion.service');

// Manejo de errores
function responderError(res, error) {
  const status = error.status || 500;

  console.error('[Error en Reuniones]:', error);

  res.status(status).json({
    mensaje: error.message || 'Error interno del servidor'
  });
}

// -------------------------------------------------------------
// OPERACIONES DE REUNIONES
// -------------------------------------------------------------

// GET /api/reuniones
async function listar(req, res) {
  try {
    const reuniones = await reunionService.listar();
    res.json(reuniones);
  } catch (error) {
    responderError(res, error);
  }
}

// GET /api/reuniones/:id
async function obtenerPorId(req, res) {
  try {
    const reunion = await reunionService.obtenerPorId(req.params.id);
    res.json(reunion);
  } catch (error) {
    responderError(res, error);
  }
}

// POST /api/reuniones
async function crear(req, res) {
  try {
    const reunion = await reunionService.crear(req.body);
    res.status(201).json(reunion);
  } catch (error) {
    responderError(res, error);
  }
}

// PUT /api/reuniones/:id
async function actualizar(req, res) {
  try {
    const reunion = await reunionService.actualizar(
      req.params.id,
      req.body
    );

    res.json(reunion);
  } catch (error) {
    responderError(res, error);
  }
}

// PATCH /api/reuniones/:id/estado
async function cambiarEstado(req, res) {
  try {
    const reunion = await reunionService.cambiarEstado(
      req.params.id,
      req.body?.estado
    );

    res.json(reunion);
  } catch (error) {
    responderError(res, error);
  }
}

// DELETE /api/reuniones/:id
async function eliminar(req, res) {
  try {
    const respuesta = await reunionService.eliminar(req.params.id);
    res.json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
}

// -------------------------------------------------------------
// OPERACIONES DE ASISTENCIA
// -------------------------------------------------------------

// GET /api/reuniones/:id/asistentes
async function listarAsistentes(req, res) {
  try {
    const asistentes = await reunionService.listarAsistentes(
      req.params.id
    );

    res.json(asistentes);
  } catch (error) {
    responderError(res, error);
  }
}

// POST /api/reuniones/:id/asistentes
async function registrarAsistencia(req, res) {
  try {
    const asistencia = await reunionService.registrarAsistencia({
      ...req.body,
      reunion_id: req.params.id
    });

    res.status(201).json(asistencia);
  } catch (error) {
    responderError(res, error);
  }
}

// PUT /api/reuniones/asistentes/:id
async function actualizarAsistencia(req, res) {
  try {
    const respuesta = await reunionService.actualizarAsistencia(
      req.params.id,
      req.body
    );

    res.json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
}

// DELETE /api/reuniones/asistentes/:id
async function eliminarAsistencia(req, res) {
  try {
    const respuesta = await reunionService.eliminarAsistencia(
      req.params.id
    );

    res.json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
}

// -------------------------------------------------------------
// EXPORTACIÓN
// -------------------------------------------------------------

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
  listarAsistentes,
  registrarAsistencia,
  actualizarAsistencia,
  eliminarAsistencia
};
