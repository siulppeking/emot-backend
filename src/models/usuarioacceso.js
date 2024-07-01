const mongoose = require('mongoose');

const UsuarioAccesoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seg_usuarios',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    host: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    }
})

const UsuarioAcceso = mongoose.model('seg_usuarioaccesos', UsuarioAccesoSchema);

module.exports = UsuarioAcceso;