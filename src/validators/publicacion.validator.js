const { check } = require("express-validator");
const { validateResult } = require("../helpers/validate.helper");

const crearPublicacion = [
    check('descripcion')
        .exists().withMessage('La descripcion debe especificarse en el cuerpo de la peticion')
        .notEmpty().withMessage('Las descripcion es requerida'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    crearPublicacion
}