// =============================================================
// proyecto.routes.js - Define las URL del módulo de proyectos
// Cada ruta une un método HTTP + una URL con una función del controlador.
// =============================================================
const express = require('express');
const proyectoController = require('../controllers/proyecto.controller');

const router = express.Router();

router.get('/', proyectoController.listar);                    // GET    /api/proyectos
router.get('/:id', proyectoController.obtenerPorId);           // GET    /api/proyectos/5
router.post('/', proyectoController.crear);                    // POST   /api/proyectos
router.put('/:id', proyectoController.actualizar);             // PUT    /api/proyectos/5
router.patch('/:id/estado', proyectoController.cambiarEstado); // PATCH  /api/proyectos/5/estado
router.delete('/:id', proyectoController.eliminar);            // DELETE /api/proyectos/5

module.exports = router;
