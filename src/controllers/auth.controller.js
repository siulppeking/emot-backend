const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario");
const UsuarioAcceso = require('../models/usuarioacceso');
const jwt = require('../helpers/jwt.helper');
const { googleVerify } = require('../helpers/google.helper');

const login = async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const { correo, clave } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).send({
                respuesta: 'ERROR',
                mensaje: 'Usuario o contraseña incorrectos',
                datos: {
                }
            })
        }
        const isMatch = await bcrypt.compare(clave, usuario.clave);
        if (!isMatch) {
            return res.status(400).send({
                respuesta: 'ERROR',
                mensaje: 'Usuario o contraseña incorrectos',
                datos: {
                }
            })
        }
        const token = await jwt.generarJWT({ userId: usuario._id });
        const usuarioAccesoNuevo = new UsuarioAcceso({
            usuario: usuario._id,
            token,
            host: clientIp,
            browser: userAgent
        });
        await usuarioAccesoNuevo.save();

        return res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Validacion correcta',
            datos: {
                userId: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                correo,
                fotoURL: usuario.fotoURL,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            respuesta: 'EXCEPCION',
            mensaje: error.message
        });
    }
}
const loginGoogle = async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const { googleToken } = req.body;

        const { nombreUsuario, fotoURL, correo } = await googleVerify(googleToken);

        const usuario = await Usuario.findOne({ correo });

        if (usuario) {
            const token = await jwt.generarJWT({ userId: usuario._id });
            const usuarioAccesoNuevo = new UsuarioAcceso({
                usuario: usuario._id,
                token,
                host: clientIp,
                browser: userAgent
            });
            await usuarioAccesoNuevo.save();
            return res.status(200).send({
                respuesta: 'OK',
                mensaje: 'Validacion correcta',
                datos: {
                    userId: usuario._id,
                    nombreUsuario,
                    correo,
                    fotoURL,
                    token
                }
            })
        }
        const userNew = new Usuario({
            nombreUsuario,
            fotoURL,
            correo,
            google: true
        });

        await userNew.save();

        const token = await jwt.generarJWT({ userId: userNew._id });
        const usuarioAccesoNuevo = new UsuarioAcceso({
            usuario: userNew._id,
            token,
            host: clientIp,
            browser: userAgent
        });
        await usuarioAccesoNuevo.save();
        return res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Validacion correcta',
            datos: {
                userId: usuario._id,
                nombreUsuario: userNew.nombreUsuario,
                correo,
                fotoURL: userNew.fotoURL,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            respuesta: 'EXCEPCION',
            mensaje: error.message,
            datos: {
            }
        })
    }
}

const registro = async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const { correo, clave } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (usuario) {
            return res.status(400).send({
                respuesta: 'ERROR',
                mensaje: 'El correo ya se encuentra registrado',
                datos: {
                }
            })
        }
        const random = (Math.floor(Math.random() * 90000000) + 10000000).toString();
        const nombreUsuario = 'usuario' + random;
        const hashedPassword = await bcrypt.hash(clave, 10);
        const userNew = new Usuario({ nombreUsuario, correo, clave: hashedPassword });
        await userNew.save();
        const token = await jwt.generarJWT({ userId: userNew._id });
        const usuarioAccesoNuevo = new UsuarioAcceso({
            usuario: userNew._id,
            token,
            host: clientIp,
            browser: userAgent
        });
        await usuarioAccesoNuevo.save();
        return res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Usuario creado correctamente',
            datos: {
                userId: usuario._id,
                nombreUsuario: userNew.nombreUsuario,
                correo,
                fotoURL: userNew.fotoURL,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            respuesta: 'EXCEPCION',
            mensaje: error.message,
            datos: {
            }
        });
    }
}

const verificar = async (req, res) => {
    try {
        const { userId } = req.token;
        const usuario = await Usuario.findById(userId);
        if (!usuario) return res.status(401).send({
            respuesta: 'ERROR_TOKEN_USUARIO',
            mensaje: 'Token invalido para usuario',
            datos: {
            }
        });

        return res.status(200).send({
            respuesta: 'OK',
            mensaje: 'Token valido',
            datos: {
                userId: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                fotoURL: usuario.fotoURL,
                correo: usuario.correo
            }
        })
    } catch (error) {
        return res.status(500).send({
            respuesta: 'EXCEPCION',
            mensaje: error.message,
            datos: {
            }
        });
    }

}

module.exports = {
    login,
    loginGoogle,
    registro,
    verificar
}