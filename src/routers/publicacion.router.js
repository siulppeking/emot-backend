const express = require('express');
const jwt = require('../helpers/jwt.helper');
const publicacionController = require('../controllers/publicacion.controller');
const publicacionValidacion = require('../validators/publicacion.validator');

const v1PublicacionRouter = express.Router();

v1PublicacionRouter.get('/', jwt.validarJWT, publicacionController.obtenerPublicaciones);
v1PublicacionRouter.post('/', jwt.validarJWT, publicacionValidacion.crearPublicacion, publicacionController.crearPublicacion);

module.exports = v1PublicacionRouter