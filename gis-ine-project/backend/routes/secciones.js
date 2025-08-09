const express = require('express');
const router = express.Router();
const { getSecciones, getSeccionByLocation } = require('../controllers/seccionesController');

// Obtener todas las secciones electorales
router.get('/', getSecciones);

// Obtener la sección electoral por ubicación (latitud, longitud)
router.get('/ubicacion', getSeccionByLocation);

module.exports = router;
