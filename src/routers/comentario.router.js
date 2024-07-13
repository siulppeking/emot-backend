const express = require('express');
const jwt = require('../helpers/jwt.helper');
const comentarioController = require('../controllers/comentario.controller');

const v1ComentarioRouter = express.Router();

v1ComentarioRouter.get('/:publicacionId', jwt.validarJWT, comentarioController.obtenerComentarios);
v1ComentarioRouter.get('/', jwt.validarJWT, comentarioController.obtenerComentariosTotal);
v1ComentarioRouter.post('/:publicacionId', jwt.validarJWT, comentarioController.agregarComentario);
v1ComentarioRouter.get('/:comentarioId/subcomentarios', jwt.validarJWT, comentarioController.obtenerSubcomentarios);
v1ComentarioRouter.post('/:comentarioId/subcomentarios', jwt.validarJWT, comentarioController.agregarSubComentario);

module.exports = v1ComentarioRouter;