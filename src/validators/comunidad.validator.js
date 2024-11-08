const { check } = require("express-validator");
const { validateResult } = require("../helpers/validate.helper");

const crearComunidad = [
    check('nombre')
        .exists().withMessage('El nombre debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('El nombre es requerido'),
    check('descripcion')
        .exists().withMessage('La descripcion debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('La descripcion es requerida'),
    check('restriccion')
        .exists().withMessage('La restriccion debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('La restriccion es requerida'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const cambiarReaccion = [
    check('publicacionId').isMongoId().withMessage('MongoID no es valido')
        .notEmpty().withMessage('publicacionId'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    crearComunidad
}