//Creamos al gimnasio y encriptamos su contraseña
const express = require("express");
const Gym = require("../models/Gym");
const Fees = require("../models/Fees");
const AuthRouterGym = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

AuthRouterGym.post("/signup", async (req, res) => {
    try {
        const { nombreCentro, password, direccion, entrenadores, cuotas, clases } = req.body;

        //Los required, los controlamos
        if (!nombreCentro || !password) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Te has dejado el nombre o la contraseña!"
            })
        }

        //que no este repetido el nombre del gym. aunque se sepa que es unico.
        const foundGymName = await Gym.findOne({ nombreCentro });

        if (foundGymName) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Ya existe un gimnasio con ese nombre!"
            })
        }

        if (password) {
            if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)) { //special/number/capital/8caracteres min))
                return res.status(403).json({
                    sucess: false,
                    mensaje: "La contraseña debe contener 6 dígitos, mayusculas, minusculas y caracteres especiales!"
                })
            }
        }

        const hash = await bcrypt.hash(password, 10); //hash la pasword ya codificada, esto encripta
        //10 son las rounds, las vueltas que da para encriptarlo.

        const gym = new Gym({
            nombreCentro,
            password: hash,
            direccion,
            entrenadores,
            cuotas,
            clases,
        })

        const newGym = await gym.save();

        return res.status(201).json({
            success: true,
            gym: newGym,
            message: "Gym añadido a la BBDD"
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message || mensaje
        })
    }
})

AuthRouterGym.post("/login", async (req, res) => {
    try {
        const { nombreCentro, password } = req.body;

        const gym = await Gym.findOne({ nombreCentro });

        if (!gym) {  //Si no encuentra el nombre del centro, el usuario no existe
            return res.status(401).json({
                sucess: false,
                message: "Wrong credentials!"
            })
        }

        const match = await bcrypt.compare(password, gym.password);   //desencripta la contraseña y mira a ver si es correcta

        if (!match) {
            return res.status(401).json({
                sucess: false,
                message: "Wrong credentials!"
            })
        }

        //CREAR TOKEN
        const token = jwt.sign({ id: gym._id }, JWT_SECRET, { expiresIn: "96h" });  //Secret key, contraseña para abrir la cajita

        return res.status(200).json({
            success: true,
            message: `Welcome: ${nombreCentro}. You're login!`,
            token
        })
    } catch (err) {
        return res.status(401).json({
            sucess: false,
            message: "Ha habido algun error con la verificacion! Acceso no permitido"
        })
    }
})

module.exports = AuthRouterGym;

