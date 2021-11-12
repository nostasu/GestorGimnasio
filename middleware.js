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

        req.user = decoded;  //como si req fuera un objeto
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: err.message || err._message
        })
    }
};

module.exports = { checkToken };