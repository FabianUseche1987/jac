const express = require('express');
const predioController = require('../controllers/predio.controller');

const router = express.Router();

router.get('/', predioController.listar);
router.get('/:id', predioController.obtenerPorId);
router.post('/', predioController.crear);
router.put('/:id', predioController.actualizar);
router.patch('/:id/estado', predioController.cambiarEstado);
router.delete('/:id', predioController.eliminar);

module.exports = router;
