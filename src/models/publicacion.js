const { Schema, model } = require('mongoose');

const PublicacionSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'seg_usuarios',
        required: true
    },
    titulo: {
        type: String,
        default: null
    },
    descripcion: {
        type: String,
        required: true
    },
    reacciones: {
        type: Array,
        default: []
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Publicacion = model('publicaciones', PublicacionSchema);

module.exports = Publicacion