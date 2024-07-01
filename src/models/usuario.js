const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    clave: {
        type: String
    },
    fotoURL: {
        type: String,
        default: 'https://res.cloudinary.com/ddsphxk7g/image/upload/v1718891536/user_2_v12lg7.png'
    },
    role: {
        type: String,
        default: 'ROL_USUARIO'
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
})

const Usuario = mongoose.model('seg_usuarios', UserSchema);

module.exports = Usuario