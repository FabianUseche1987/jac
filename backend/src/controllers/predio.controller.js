// =============================================================
// predio.controller.js - Capa de control
// =============================================================
const predioService = require('../services/predio.service');

function responderError(res, error) {
  const status = error.status || 500;
  console.error('[Error en Predios]:', error);
  res.status(status).json({
    mensaje: error.message || 'Error interno del servidor'
  });
}

async function listar(req, res) {
  try {
    const predios = await predioService.listar();
    res.json(predios);
  } catch (error) {
    responderError(res, error);
  }
}

async function obtenerPorId(req, res) {
  try {
    const predio = await predioService.obtenerPorId(req.params.id);
    res.json(predio);
  } catch (error) {
    responderError(res, error);
  }
}

async function crear(req, res) {
  try {
    const predio = await predioService.crear(req.body);
    res.status(201).json(predio);
  } catch (error) {
    responderError(res, error);
  }
}

async function actualizar(req, res) {
  try {
    const predio = await predioService.actualizar(req.params.id, req.body);
    res.json(predio);
  } catch (error) {
    responderError(res, error);
  }
}

async function cambiarEstado(req, res) {
  try {
    const predio = await predioService.cambiarEstado(req.params.id, req.body?.estado);
    res.json(predio);
  } catch (error) {
    responderError(res, error);
  }
}

async function eliminar(req, res) {
  try {
    const respuesta = await predioService.eliminar(req.params.id);
    res.json(respuesta);
  } catch (error) {
    responderError(res, error);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, eliminar };
