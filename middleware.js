const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//recoge el token, ver que es correcto, y si es correcto lo devuelve
let checkToken = async (req, res, next) => {
    try {
        //El token lo recibimos en postman, lo enviamos en authorization (typeBearerToken) 
        //Lo mandaremos a traves del header
        let token = req.headers["x-acces-token"] || req.headers["authorization"];

        if (token && token.startsWith("Bearer")) {
            token = token.slice(7, token.lenght)  //Remove Bearer de la String
        }

        if (!token) {  //Si no hay token, me mandas un error
            return res.status(401).json({
                success: false,
                message: "token not found"
            });
        }

        const decoded = await jwt.verify(token, JWT_SECRET);

        console.log(decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: err.message || err._message
        })
    }
};
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.status(err.status || 400).send({
        success: false,
        message: err._message || err.message
    });
};

module.exports = { checkToken, errorHandler };