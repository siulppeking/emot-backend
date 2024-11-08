const cloudinary = require('cloudinary').v2
const Comunidad = require("../models/comunidad");
const moment = require('../helpers/moment.helper');

cloudinary.config(process.env.CLOUDINARY_URL);

const obtenerComunidad = async (req, res) => {
    const { userId } = req.token;
    const comunidades = await Comunidad.find({ estado: true, usuario: userId });

    const comunidadesResponse = comunidades.map(comunidad => {
        return {
            comunidadId: comunidad._id,
            nombre: comunidad.nombre,
            descripcion: comunidad.descripcion,
            imagenUrl: comunidad.imagenUrl,
            restriccion: comunidad.restriccion,
            fechaCreacion1: moment.momentFromNow(comunidad.fechaCreacion),
            fechaCreacion2: moment.momentFormat(comunidad.fechaCreacion, 'DD/MM/YYYY'),
            fechaCreacion3: moment.momentFormat(comunidad.fechaCreacion, 'HH:mm:ss'),
        }
    });

    return res.status(200).send({
        estado: 'OK',
        datos: comunidadesResponse
    })
}

const crearComunidad = async (req, res) => {

    try {
        const { userId } = req.token;

        if (!req.files || !req.files.imagen) {
            return res.status(404).send({
                respuesta: 'ERROR',
                mensaje: 'Debe seleccionar una imagen para su comunidad'
            });
        }

        const { imagen } = req.files;
        const split = imagen.name.split('.');

        const extension = split[split.length - 1];
        const extensionesValidas = ['jpg', 'jpeg', 'png'];

        if (!extensionesValidas.includes(extension)) {
            return res.status(400).send({
                status: "ERROR",
                message: `Extension .${extension} no es valida, solo ${extensionesValidas} son aceptadas`
            })
        }

        const comunidades = await Comunidad.find({ estado: true, usuario: userId });
        console.log(comunidades.length);
        if (comunidades.length >= 3) {
            return res.status(400).send({
                respuesta: 'ERROR',
                mensaje: 'Solo puede crear un maximo de 3 comunidades'
            });
        }

        const { tempFilePath } = req.files.imagen;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        const { nombre, descripcion, restriccion } = req.body;
        const comunidadNueva = new Comunidad({
            usuario: userId,
            nombre,
            descripcion,
            restriccion,
            imagenUrl: secure_url
        });

        await comunidadNueva.save();

        const comunidadResponse = {
            comunidadId: comunidadNueva._id,
            nombre: comunidadNueva.nombre,
            descripcion: comunidadNueva.descripcion,
            imagenUrl: comunidadNueva.imagenUrl,
            restriccion: comunidadNueva.restriccion,
            fechaCreacion1: moment.momentFromNow(comunidadNueva.fechaCreacion),
            fechaCreacion2: moment.momentFormat(comunidadNueva.fechaCreacion, 'DD/MM/YYYY'),
            fechaCreacion3: moment.momentFormat(comunidadNueva.fechaCreacion, 'HH:mm:ss'),
        }
        return res.status(200).send({
            estado: 'OK',
            mensaje: 'Comunidad creada correctamente',
            datos: comunidadResponse
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            respuesta: 'EXCEPTION',
            mensaje: error.message
        });
    }


}

module.exports = {
    obtenerComunidad,
    crearComunidad
}