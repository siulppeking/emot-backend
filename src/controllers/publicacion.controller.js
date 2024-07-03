const Publicacion = require("../models/publicacion");
const moment = require('../helpers/moment.helper');
const Reaccion = require("../models/reaccion");

const obtenerPublicaciones = async (req, res) => {
    try {
        const { userId } = req.token;
        const publicaciones = await Publicacion.find().populate('usuario').sort({ fechaCreacion: -1 });

        const publicacionesResponse = publicaciones.map(publicacion => {
            return {
                publicacionId: publicacion._id,
                titulo: publicacion.titulo,
                descripcion: publicacion.descripcion,
                fechaCreacion: moment.momentFormat(publicacion.fechaCreacion, 'DD/MM/YYYY HH:mm:ss'),
                fecCreFormato1: moment.momentFormat(publicacion.fechaCreacion, 'DD/MM/YYYY'),
                fecCreFormato2: moment.momentFormat(publicacion.fechaCreacion, 'HH:mm:ss'),
                fecCreFormato3: moment.momentFromNow(publicacion.fechaCreacion),
                reacciones: publicacion.reacciones.length,
                reaccionado: publicacion.reacciones.includes(userId),
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
        fechaCreacion: moment.momentFormat(publicacionCreada.fechaCreacion, 'DD/MM/YYYY HH:mm:ss'),
        fecCreFormato1: moment.momentFormat(publicacionCreada.fechaCreacion, 'DD/MM/YYYY'),
        fecCreFormato2: moment.momentFormat(publicacionCreada.fechaCreacion, 'HH:mm:ss'),
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
        fechaCreacion: moment.momentFormat(publicacionNueva.fechaCreacion, 'DD/MM/YYYY HH:mm:ss'),
        fecCreFormato1: moment.momentFormat(publicacionNueva.fechaCreacion, 'DD/MM/YYYY'),
        fecCreFormato2: moment.momentFormat(publicacionNueva.fechaCreacion, 'HH:mm:ss'),
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

