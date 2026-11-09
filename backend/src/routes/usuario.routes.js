// =============================================================
// usuario.routes.js - Define las URL del módulo de usuarios
// Cada ruta une un método HTTP + una URL con una función del controlador.
// =============================================================
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');

const router = express.Router();

router.get('/', usuarioController.listar);                     // GET   /api/usuarios
router.get('/:id', usuarioController.obtenerPorId);            // GET   /api/usuarios/5
router.post('/', usuarioController.crear);                     // POST  /api/usuarios
router.put('/:id', usuarioController.actualizar);              // PUT   /api/usuarios/5
router.patch('/:id/estado', usuarioController.cambiarEstado);  // PATCH /api/usuarios/5/estado

module.exports = router;
