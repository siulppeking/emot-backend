const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(400)
        res.send({
            respuesta: 'ERRORES',
            mensaje: 'Errores de validacion',
            datos: {
                errores: err.array()
            }
        })
    }
}

module.exports = { validateResult }