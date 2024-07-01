const { check } = require("express-validator");
const { validateResult } = require("../helpers/validate.helper");

const login = [
    check('correo')
        .exists().withMessage('Correo debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('Correo no puede ser vacio')
        .isEmail().withMessage('Clave no puede ser vacio')
        .isLength({ min: 6 }).withMessage('Clave debe ser minimo 6 digitos'),
    check('clave')
        .exists().withMessage('Clave debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const loginGoogle = [
    check('googleToken')
        .exists().withMessage('Google token debe especificarse en el cuerpode la peticion')
        .notEmpty().withMessage('Google token no debe vacio'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const registro = [
    check('correo')
        .exists().withMessage('Correo debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('Correo no puede ser vacio')
        .isEmail().withMessage('Correo tiene que ser valido'),

    check('clave')
        .exists().withMessage('Clave debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('Clave no puede ser vacio')
        .isLength({ min: 6 }).withMessage('Clave debe ser minimo 6 digitos'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    login,
    loginGoogle,
    registro
}