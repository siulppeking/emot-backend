const { Schema, model } = require('mongoose');

const ReaccionSchema = new Schema({
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'publicaciones',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'seg_usuarios',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Reaccion = model('reacciones', ReaccionSchema);

module.exports = Reaccion;