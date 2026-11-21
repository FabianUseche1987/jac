// =============================================================
// proyecto.controller.js - Capa de control
// Recibe la petición HTTP, llama al servicio y responde en JSON.
// =============================================================
const proyectoService = require('../services/proyecto.service');

// Responde con el código del error (400, 404, 409) o 500 si fue algo inesperado
function responderError(res, error) {
  const status = error.status || 500;
  console.error('[Error en Proyectos]:', error); // se ve en la terminal para depurar
  res.status(status).json({
    mensaje: error.message || 'Error interno del servidor'
  });
}

// GET /api/proyectos
async function listar(req, res) {
  try {
    const proyectos = await proyectoService.listar();
    res.json(proyectos);
  } catch (error) {
    responderError(res, error);
  }
}

// GET /api/proyectos/:id
async function obtenerPorId(req, res) {
  try {
    const proyecto = await proyectoService.obtenerPorId(req.params.id);
    res.json(proyecto);
  } catch (error) {
    responderError(res, error);
  }
}

// POST /api/proyectos
async function crear(req, res) {
  try {
    const proyecto = await proyectoService.crear(req.body);
    res.status(201).json(proyecto); // 201 = Recurso creado exitosamente
  } catch (error) {
    responderError(res, error);
  }
}

// PUT /api/proyectos/:id
async function actualizar(req, res) {
  try {
    const proyecto = await proyectoService.actualizar(req.params.id, req.body);
    res.json(proyecto);
  } catch (error) {
    responderError(res, error);
  }
}

// PATCH /api/proyectos/:id/estado
async function cambiarEstado(req, res) {
  try {
    const proyecto = await proyectoService.cambiarEstado(req.params.id, req.body?.estado);
    res.json(proyecto);
  } catch (error) {
    responderError(res, error);
  }
}

// DELETE /api/proyectos/:id
async function eliminar(req, res) {
  try {
    const respuesta = await proyectoService.eliminar(req.params.id);
    res.json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, eliminar };
