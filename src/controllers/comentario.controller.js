const Comentario = require("../models/comentario");
const Publicacion = require("../models/publicacion");
const moment = require('../helpers/moment.helper');

const obtenerComentarios = async (req, res) => {
    try {
        const { publicacionId } = req.params;
        const publicacion = await Publicacion.findById(publicacionId);

        if (!publicacion) {
            return res.status(404).send({
                respuesta: 'ERROR',
                mensaje: 'La publicación ' + publicacionId + 'fue encontrada'
            });
        }

        // obtiene todos los comentarios de la publicacion
        const comentarios = await Comentario.find({ publicacion: publicacionId, subComentario: null })
            .populate('usuario')
            .sort({ fechaCreacion: -1 });

        const comentarioRespuesta = comentarios.map(comentario => {
            return {
                comentarioId: comentario._id,
                texto: comentario.texto,
                fechaCreacion: moment.momentFromNow(comentario.fechaCreacion),
                usuario: {
                    nombreUsuario: comentario.usuario.nombreUsuario,
                    fotoURL: comentario.usuario.fotoURL
                }
            }
        });

        return res.status(200).send({
            respuesta: 'OK',
            datos: comentarioRespuesta
        });
    } catch (err) {
        return res.status(500).send({
            respuesta: 'EXCEPTION',
            mensaje: err.message
        });
    }
}

const agregarComentario = async (req, res) => {
    try {
        const { userId } = req.token;
        const { publicacionId } = req.params;
        const { texto } = req.body;

        const publicacion = await Publicacion.findById(publicacionId);

        if (!publicacion) {
            return res.status(404).send({
                respuesta: 'ERROR',
                mensaje: 'La publicación ' + publicacionId + ' fue encontrada'
            });
        }

        const comentarioNuevo = new Comentario({
            usuario: userId,
            publicacion: publicacionId,
            texto
        });

        await comentarioNuevo.save();

        const comentarioPop = await Comentario.findById(comentarioNuevo._id)
            .populate('usuario');

        const comentarioRespuesta = {
            comentarioId: comentarioPop._id,
            texto: comentarioPop.texto,
            fechaCreacion: moment.momentFromNow(comentarioPop.fechaCreacion),
            usuario: {
                nombreUsuario: comentarioPop.usuario.nombreUsuario,
                fotoURL: comentarioPop.usuario.fotoURL
            }
        }
        return res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Comentario agregado correctamente',
            datos: comentarioRespuesta
        });
    } catch (err) {
        return res.status(500).send({
            respuesta: 'EXCEPTION',
            mensaje: err.message
        });
    }
}

const obtenerSubcomentarios = async (req, res) => {
    try {
        const { comentarioId } = req.params;
        const comentarios = await Comentario.find({ subComentario: comentarioId })
            .populate('usuario');

        const comentarioRespuesta = comentarios.map(comentario => {
            return {
                comentarioId: comentario._id,
                texto: comentario.texto,
                fechaCreacion: moment.momentFromNow(comentario.fechaCreacion),
                usuario: {
                    nombreUsuario: comentario.usuario.nombreUsuario,
                    fotoURL: comentario.usuario.fotoURL
                }
            }
        });

        return res.status(200).send({
            respuesta: 'OK',
            datos: comentarioRespuesta
        });
    } catch (err) {
        return res.status(500).send({
            respuesta: 'EXCEPTION',
            mensaje: err.message
        });
    }
}


const agregarSubComentario = async (req, res) => {
    try {
        const { userId } = req.token;
        const { comentarioId } = req.params;
        const comentario = await Comentario.findById(comentarioId);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        const subComentario = new Comentario({
            usuario: userId,
            publicacion: comentario.publicacion,
            subComentario: comentarioId,
            texto: req.body.texto
        });

        await subComentario.save();

        const comentarioPop = await Comentario.findById(subComentario._id)
            .populate('usuario');

        const comentarioRespuesta = {
            comentarioId: comentarioPop._id,
            texto: comentarioPop.texto,
            fechaCreacion: moment.momentFromNow(comentarioPop.fechaCreacion),
            usuario: {
                nombreUsuario: comentarioPop.usuario.nombreUsuario,
                fotoURL: comentarioPop.usuario.fotoURL
            }
        }
        return res.status(201).send({
            respuesta: 'OK',
            datos: comentarioRespuesta
        });

    } catch (err) {
        return res.status(500).send({
            respuesta: 'EXCEPTION',
            mensaje: err.message
        });
    }
}

module.exports = {
    obtenerComentarios,
    obtenerSubcomentarios,
    agregarComentario,
    agregarSubComentario
}