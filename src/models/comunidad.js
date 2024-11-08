const { Schema, model } = require('mongoose');

const ComunidadSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'seg_usuarios',
        required: true
    },
    nombre: {
        type: String,
        default: null
    },
    descripcion: {
        type: String,
        default: null
    },
    imagenUrl: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    },
    restriccion: {
        type: String,
        enum: ['publica', 'privada'],
        required: true
    }
});

const Comunidad = model('comunidades', ComunidadSchema);

module.exports = Comunidad