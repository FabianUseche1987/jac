
// =============================================================
// reunion.routes.js - Rutas del módulo de reuniones
// =============================================================

const express = require('express');
const reunionController = require('../controllers/reunion.controller');

const router = express.Router();

// Rutas de reuniones
router.get('/', reunionController.listar);
router.post('/', reunionController.crear);

// Rutas de asistencia
router.get('/:id/asistentes', reunionController.listarAsistentes);
router.post('/:id/asistentes', reunionController.registrarAsistencia);

router.put('/asistentes/:id', reunionController.actualizarAsistencia);
router.delete('/asistentes/:id', reunionController.eliminarAsistencia);

// Cambiar estado de una reunión
router.patch('/:id/estado', reunionController.cambiarEstado);

// Consultar, actualizar y eliminar reuniones
router.get('/:id', reunionController.obtenerPorId);
router.put('/:id', reunionController.actualizar);
router.delete('/:id', reunionController.eliminar);

module.exports = router;
