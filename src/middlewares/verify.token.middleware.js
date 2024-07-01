const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) return res.status(401).send({
        status: "VALIDATION_TOKEN_EMPTY",
        data: { message: "Token is required" }
    });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, token) => {
        if (err) {
            return res.status(401).send({
                status: "VALIDATION_TOKEN_INVALID",
                data: { message: "Token is invalid" }
            });
        } else {
            req.token = token;
            next();
        }
    })
}

module.exports = {
    verifyToken
}