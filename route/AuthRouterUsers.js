//Creamos al usuario y encriptamos su contraseña
const express = require("express");
const User = require("../models/User");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

AuthRouter.post("/signup", async (req, res, next) => {
    try {
        const { nombre, apellidos, telefono, email, password, fechaInicio, gimnasio, cuota, reservas } = req.body;

        if (!nombre || !apellidos || !email || !password || !gimnasio || !cuota) {
            return next({
                sucess: false,
                message: "Required fields: nombre, apellidos, email, password, gimnasio, cuota"
            })
        }

        const foundUser = await User.findOne({ email });

        if (foundUser) {
            return next({
                sucess: false,
                message: "Hey! The mail already exits! Try to login"
            })
        }

        const gymExiste = await Gym.findById(gimnasio);
        if (gimnasio) {
            if (!gymExiste) {
                return next({
                    sucess: false,
                    message: `Hey! There isn't any gym with with this id: ${gimnasio}!`
                })
            }
        }

        if (cuota) {
            let existeCuota = gymExiste.cuotas.find(cuotaGym => cuotaGym.equals(cuota));
            if (!existeCuota) {
                return res.status(403).json({
                    success: false,
                    message: `Hey! There isn't any fee in the gym ${gymExiste.nombreCentro} with with this id: ${gimnasio}!`
                });
            }
        }

        if (password) {
            if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)) { //special/number/capital/6 characters min))
                return res.status(403).json({
                    sucess: false,
                    message: "The password must contain 6 dígits, uppercase, lowercase and special characters!"
                })
            }
        }

        const hash = await bcrypt.hash(password, 10);

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
        return next({
            status: 403,
            message: err
        });
    }
})

AuthRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return next({
                sucess: false,
                message: "Wrong credentials!"
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return next({
                sucess: false,
                message: "Wrong credentials!"
            })
        }

        //CREAR TOKEN
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "96h" });

        return res.status(200).json({
            success: true,
            message: `Welcome: ${user.nombre}, you're login!`,
            token
        })
    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})

module.exports = AuthRouter;

