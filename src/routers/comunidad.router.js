const express = require('express');
const jwt = require('../helpers/jwt.helper');
const controller = require('../controllers/comunidad.controller');
const validar = require('../validators/comunidad.validator');

const v1ComunidadRouter = express.Router();

v1ComunidadRouter.get('/', jwt.validarJWT, controller.obtenerComunidad);
v1ComunidadRouter.post('/', jwt.validarJWT, validar.crearComunidad, controller.crearComunidad);

module.exports = v1ComunidadRouter;