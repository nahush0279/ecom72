const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.json({"message" : "no auth header"});

    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET),
        (err, decoded) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = decoded;
            next();
        }
    );
}

module.exports = verifyJWT;
