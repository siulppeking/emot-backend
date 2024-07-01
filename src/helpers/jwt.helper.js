const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '3600s'
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}

const generarJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            // expira en 10 segundos
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                reject('Error generando el token');
            }
            resolve(token);
        })
    });
}

const validarJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.token = payload;
        next();
    } catch (error) {
        console.log(`validarJWT(): ${error.message}`);
        return res.status(401).json({ msg: 'Token inválido' });
    }
}

module.exports = {
    createAccessToken,
    generarJWT,
    validarJWT
}