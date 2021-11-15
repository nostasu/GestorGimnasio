//Creamos al usuario y encriptamos su contraseña
const express = require("express");
const User = require("../models/User");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

AuthRouter.post("/signup", async (req, res) => {
    try {
        const { nombre, apellidos, telefono, email, password, fechaInicio, gimnasio, cuota, reservas } = req.body;

        if (!nombre || !apellidos || !email || !password) {
            return res.status(403).json({
                sucess: false,
                message: "faltan datos"
            })
        }

        //que no este repetido. aunque se sepa que es unico.
        const foundUser = await User.findOne({ email });

        if (foundUser) {
            return res.status(403).json({
                sucess: false,
                message: "este mail ya existe"
            })
        }

        const gymExiste = await Gym.findById(gimnasio);
        //Al meter un usuario nuevo, comprobar que la cuota existe en el gym (gym.cuotas)
        if (gimnasio) {
            if (!gymExiste) {
                return res.status(403).json({
                    sucess: false,
                    message: "Hey!Ese gimnasio no existe!"
                })
            }
        }

        if (cuota) {
            let existeCuota = gymExiste.cuotas.find(cuotaGym => cuotaGym.equals(cuota));
            if (!existeCuota) {
                return res.status(403).json({
                    success: false,
                    message: "No se ha encontrado esa cuota para ese gimnasio!"
                });
            }
        }

        const hash = await bcrypt.hash(password, 10); //hash la pasword ya codificada, esto encripta
        //10 son las rounds, las vueltas que da para encriptarlo.

        const user = new User({
            nombre,
            apellidos,
            telefono,
            email,
            password: hash,
            fechaInicio,
            gimnasio,
            cuota,
            reservas
        })

        const newUser = await user.save();

        return res.status(201).json({
            success: true,
            user: newUser,
        })

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message || message
        })
    }
})

AuthRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {  //Si no encuentra el email, el usuario no existe
        return res.status(401).json({
            sucess: false,
            message: "Wrong credentials!"
        })
    }

    const match = await bcrypt.compare(password, user.password);   //desencripta la contraseña y mira a ver si es correcta

    if (!match) {
        return res.status(401).json({
            sucess: false,
            message: "Wrong credentials!"
        })
    }

    //CREAR TOKEN
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "96h" });  //Secret key, contraseña para abrir la cajita

    return res.status(200).json({
        success: true,
        message: `Welcome: ${user.nombre}, you're login!`,
        token
    })
})

module.exports = AuthRouter;

