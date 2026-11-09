// =============================================================
// usuario.controller.js - Capa de control
// Recibe la petición HTTP, llama al servicio y responde en JSON.
// =============================================================
const usuarioService = require('../services/usuario.service');

// Responde con el código del error (400, 404, 409) o 500 si fue algo inesperado
function responderError(res, error) {
  const status = error.status || 500;
  if (status === 500) console.error(error); // los errores inesperados se ven en la terminal
  res.status(status).json({
    mensaje: status === 500 ? 'Error interno del servidor' : error.message
  });
}

// GET /api/usuarios
async function listar(req, res) {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
  } catch (error) {
    responderError(res, error);
  }
}

// GET /api/usuarios/:id
async function obtenerPorId(req, res) {
  try {
    const usuario = await usuarioService.obtenerPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
}

// POST /api/usuarios
async function crear(req, res) {
  try {
    const usuario = await usuarioService.crear(req.body);
    res.status(201).json(usuario); // 201 = creado
  } catch (error) {
    responderError(res, error);
  }
}

// PUT /api/usuarios/:id
async function actualizar(req, res) {
  try {
    const usuario = await usuarioService.actualizar(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
}

// PATCH /api/usuarios/:id/estado  →  cuerpo: { "estado": "inactivo" }
async function cambiarEstado(req, res) {
  try {
    const usuario = await usuarioService.cambiarEstado(req.params.id, req.body?.estado);
    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado };
