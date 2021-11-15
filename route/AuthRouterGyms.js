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
        if (!nombreCentro) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Te has dejado o el nombre!"
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

        console.log(cuotas.length);
        if (cuotas) {
            for (let i = 0; i < cuotas.length; i++) {
                console.log(cuotas[i]);
                const existeCuota = await Fees.findById(cuotas[i]);
                if (!existeCuota) {
                    return res.status(403).json({
                        sucess: false,
                        mensaje: "No existe esa cuota!"
                    })
                }
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
            user: newGym,
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message || message
        })
    }
})

AuthRouterGym.post("/login", async (req, res) => {
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
})

module.exports = AuthRouterGym;

