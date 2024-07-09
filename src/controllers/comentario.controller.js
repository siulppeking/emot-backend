const Comentario = require("../models/comentario");
const Publicacion = require("../models/publicacion");

const obtenerComentarios = async (req, res) => {
    try {
        // obtiene los datos de la publicacion
        const { publicacionId } = req.params;

        // busca la publicacion en la base de datos
        const publicacion = await Publicacion.findById(publicacionId);

        if (!publicacion) return res.status(404).send({
            respuesta: 'ERROR',
            mensaje: 'La publicación ' + publicacionId + 'fue encontrada'
        });

        // obtiene todos los comentarios de la publicacion
        const comentarios = await Comentario.find({ publicacion: publicacionId }).populate('usuario').populate('subComentarios');

        // return de la respuesta
        res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Comentarios obtenidos correctamente',
            datos: comentarios
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
        const comentario = await Comentario.findById(req.params.comentarioId);

        if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });

        res.json(comentario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const agregarComentario = async (req, res) => {
    try {
        // obtiene los datos del usuario y la publicacion
        const { userId } = req.token;
        const { publicacionId } = req.params;
        const { texto } = req.body;

        // busca la publicacion en la base de datos
        const publicacion = await Publicacion.findById(publicacionId);

        if (!publicacion) return res.status(404).send({
            respuesta: 'ERROR',
            mensaje: 'La publicación ' + publicacionId + ' fue encontrada'
        });

        // crea un nuevo comentario con los datos del usuario y la publicacion
        const nuevoComentario = new Comentario({
            usuario: userId,
            publicacion: publicacionId,
            texto
        });

        // guarda el nuevo comentario en la base de datos
        await nuevoComentario.save();
        // return de la respuesta
        res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Comentario agregado correctamente',
            datos: nuevoComentario
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
        const comentario = await Comentario.findById(req.params.comentarioId);
        if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });

        const subComentario = new Comentario({
            usuario: userId,
            texto: req.body.texto
        });

        comentario.subComentarios.push(subComentario);
        await comentario.save();
        res.status(201).json(comentario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    obtenerComentarios,
    obtenerSubcomentarios,
    agregarComentario,
    agregarSubComentario
}