const { Schema, model } = require('mongoose');

const ComentarioSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'seg_usuarios',
        required: true
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'publicaciones',
        required: true
    },
    texto: {
        type: String,
        default: null
    },
    subComentarios: {
        type: Array,
        ref: 'comentarios',
        default: null
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

const Comentario = model('comentarios', ComentarioSchema);

module.exports = Comentario