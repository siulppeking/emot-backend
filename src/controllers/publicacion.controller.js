const Publicacion = require("../models/publicacion");
const Reaccion = require("../models/reaccion");
const moment = require('../helpers/moment.helper');
const Comentario = require("../models/comentario");

const obtenerPublicaciones = async (req, res) => {
    try {
        const { userId } = req.token;

        const [publicaciones, comentarios, subComentarios] = await Promise.all([
            Publicacion.find().populate('usuario').sort({ fechaCreacion: -1 }),
            Comentario.find({ subComentario: null })
                .populate('usuario')
                .sort({ fechaCreacion: -1 }),
            Comentario.find({ subComentario: { $ne: null } })
                .populate('usuario')
                .sort({ fechaCreacion: -1 }),
        ]);

        const subComentariosRespuesta = subComentarios.map(comentario => {
            return {
                publicacionId: comentario.publicacion,
                comentarioId: comentario._id,
                subComentarioId: comentario.subComentario,
                texto: comentario.texto,
                fechaCreacion: moment.momentFromNow(comentario.fechaCreacion),
                usuario: {
                    nombreUsuario: comentario.usuario.nombreUsuario,
                    fotoURL: comentario.usuario.fotoURL
                }
            }
        });

        const comentariosRespuesta = comentarios.map(comentario => {
            return {
                publicacionId: comentario.publicacion,
                comentarioId: comentario._id,
                texto: comentario.texto,
                fechaCreacion: moment.momentFromNow(comentario.fechaCreacion),
                usuario: {
                    nombreUsuario: comentario.usuario.nombreUsuario,
                    fotoURL: comentario.usuario.fotoURL
                },
                subComentarios: subComentariosRespuesta.filter(subComentario => subComentario.subComentarioId.equals(comentario._id))
            }
        });



        const publicacionesResponse = publicaciones.map(publicacion => {
            return {
                publicacionId: publicacion._id,
                titulo: publicacion.titulo,
                descripcion: publicacion.descripcion,
                fecCreFormato3: moment.momentFromNow(publicacion.fechaCreacion),
                reacciones: publicacion.reacciones.length,
                reaccionado: publicacion.reacciones.includes(userId),
                comentarios: comentariosRespuesta.filter(comentario => comentario.publicacionId.equals(publicacion._id)),
                usuario: {
                    nombreUsuario: publicacion.usuario.nombreUsuario,
                    fotoURL: publicacion.usuario.fotoURL
                }
            }
        })

        return res.status(200).send({
            estado: 'OK',
            datos: publicacionesResponse
        })
    } catch (error) {
        console.log('Error: publicacion.controller.js - obtenerPublicaciones(): ' + error.message);
        return res.status(500).send({
            respuesta: 'EXCEPCION',
            mensaje: error.message,
        });
    }

}

const crearPublicacion = async (req, res) => {
    const { userId } = req.token;
    const { titulo, descripcion } = req.body;

    const publicacionData = {
        usuario: userId,
        titulo,
        descripcion
    }
    const publicacionNueva = new Publicacion(publicacionData);
    await publicacionNueva.save();
    const publicacionCreada = await Publicacion.findById(publicacionNueva._id).populate('usuario')
    const publicacionRespuesta = {
        publicacionId: publicacionCreada._id,
        titulo: publicacionCreada.titulo,
        descripcion: publicacionCreada.descripcion,
        fecCreFormato3: moment.momentFromNow(publicacionCreada.fechaCreacion),
        usuario: {
            nombreUsuario: publicacionCreada.usuario.nombreUsuario,
            fotoURL: publicacionCreada.usuario.fotoURL
        }
    }
    return res.status(201).send({
        estado: 'OK',
        mensaje: 'Publicacion creada correctamente',
        datos: publicacionRespuesta
    })
}

const cambiarReaccion = async (req, res) => {
    const { userId } = req.token;
    const { publicacionId } = req.params;

    const publicacion = await Publicacion.findById(publicacionId);

    if (!publicacion) return res.status(404).send({
        respuesta: 'ERROR',
        mensaje: `Publicacion ${publicacionId} no existe`,
    });

    if (publicacion.reacciones.includes(userId)) {
        await Publicacion.updateOne({ _id: publicacionId }, { $pull: { reacciones: userId } });
        await Reaccion.deleteOne({ publicacion: publicacionId, usuario: userId });
    } else {
        await Publicacion.updateOne({ _id: publicacionId }, { $push: { reacciones: userId } });
        const reaccionNueva = new Reaccion({ publicacion: publicacionId, usuario: userId });
        await reaccionNueva.save();
    }
    const publicacionNueva = await Publicacion.findById(publicacionId).populate('usuario');
    const publicacionResponse = {
        publicacionId: publicacionNueva._id,
        titulo: publicacionNueva.titulo,
        descripcion: publicacionNueva.descripcion,
        fecCreFormato3: moment.momentFromNow(publicacionNueva.fechaCreacion),
        reacciones: publicacionNueva.reacciones.length,
        reaccionado: publicacionNueva.reacciones.includes(userId),
        usuario: {
            nombreUsuario: publicacionNueva.usuario.nombreUsuario,
            fotoURL: publicacionNueva.usuario.fotoURL
        }
    }
    return res.status(201).send({
        estado: 'OK',
        mensaje: 'Reaccion agregada correctamente',
        datos: publicacionResponse
    })
}

module.exports = {
    obtenerPublicaciones,
    crearPublicacion,
    cambiarReaccion
}

