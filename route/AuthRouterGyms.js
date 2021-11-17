const express = require("express");
const Gym = require("../models/Gym");
const Fees = require("../models/Fees");
const AuthRouterGym = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

AuthRouterGym.post("/signup", async (req, res, next) => {
    try {
        const { nombreCentro, password, direccion, entrenadores, cuotas, clases } = req.body;

        if (!nombreCentro || !password) {
            return next({
                sucess: false,
                message: "Required fields: nombreCentro, password!"
            })
        }

        const foundGymName = await Gym.findOne({ nombreCentro });

        if (foundGymName) {
            return next({
                sucess: false,
                message: "Already exists a gym with this name!"
            })
        }

        if (password) {
            if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)) { //special/number/capital/6 characters))
                return next({
                    sucess: false,
                    message: 'The password must contain 6 dígits, uppercase, lowercase and special characters'
                })
            }
        }

        const hash = await bcrypt.hash(password, 10);

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
            message: "Gym created succesfully"
        })

    } catch (err) {
        return next({
            status: 403,
            message: err.message
        });
    }
})

AuthRouterGym.post("/login", async (req, res, next) => {
    try {
        const { nombreCentro, password } = req.body;

        const gym = await Gym.findOne({ nombreCentro });

        if (!gym) {
            return next({
                sucess: false,
                message: "Wrong credentials!"
            })
        }

        const match = await bcrypt.compare(password, gym.password);   //desencripta la contraseña y mira a ver si es correcta

        if (!match) {
            return next({
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
        return next({
            status: 403,
            message: err
        });
    }
})

module.exports = AuthRouterGym;

