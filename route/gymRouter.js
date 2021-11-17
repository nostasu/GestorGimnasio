const express = require("express");
const Gym = require("../models/Gym"); //requerimos el export
const Users = require("../models/User");
const Class = require("../models/Class");
const { checkToken } = require("../middleware");
const gymRouter = express.Router();

gymRouter
    .route("/")
    //Shows the name of all the users in the gym.
    .get(checkToken, async (req, res, next) => {
        try {
            const { id } = req.user; //La id del gym que esta conectado

            let gym = await Gym.findById(id);
            if (!gym) {
                return next({
                    sucess: false,
                    message: "There isn'n any gym with this id"
                })
            }

            const usuariosGym = await Users.find().populate("gimnasio", "nombreCentro");

            const usFiltrados = usuariosGym.filter(user => {
                if (user.gimnasio.equals(id)) {
                    return user;
                }
            });

            if (usFiltrados.length == 0) {
                return next({
                    sucess: false,
                    message: "This gym has no users yet"
                })
            }

            return res.status(201).json({
                success: true,
                usFiltrados
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })
    //Updating the gym
    .put(checkToken, async (req, res, next) => {
        try {
            const { id } = req.user  //La id del gimnasio

            const { direccion, entrenadores } = req.body;

            let gym = await Gym.findById(id);
            if (!gym) {
                return next({
                    sucess: false,
                    message: "There isn't any gym with this id"
                })
            }

            if (direccion) {
                gym.direccion = direccion;
            }
            if (entrenadores) {
                gym.entrenadores = entrenadores;
            }

            const gymUpdate = await gym.save();
            return res.status(201).json({
                sucess: true,
                gymUpdate
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })

    .delete(checkToken, async (req, res, next) => {
        try {
            const { id } = req.user;

            let gymBorrado = await Gym.findById(id);
            if (!gymBorrado) {
                return next({
                    sucess: false,
                    message: "There isn't any gym with this id"
                })
            }

            //Delete all the classes of the model Classes that are created by the gym
            gymBorrado.clases.forEach(async claseBorrar => {
                let clase = await Class.findByIdAndDelete(claseBorrar._id);
                console.log(`Class deleted: ${clase} successfully`);
            })

            //Delete the field reservas, cuota y gym to the users of the gym
            let usuarios = await Users.find({ gimnasio: id });
            usuarios.forEach(async user => {
                user.gimnasio = null;
                user.cuota = null;
                user.reservas = [];
                await user.save();
            });

            //Delete in Fees all the Fees created by the gym
            gymBorrado.cuotas.forEach(async cuotaGym => {
                await Fees.findByIdAndDelete(cuotaGym);
            })
            await Gym.findByIdAndDelete(id);

            return res.status(201).json({
                sucess: true,
                message: `Gym deleted: ${id} successfully`
            });

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    });


//Find a gym
gymRouter.get("/find/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const gym = await Gym.findById(id);
        if (!gym) {
            return next({
                sucess: false,
                message: `There isn't any gym with this id: ${id}`
            })
        }
        return res.status(201).json({
            success: true,
            gym
        })
    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})

//Show all the gyms
gymRouter.get("/allGyms", async (req, res, next) => {
    try {
        let gyms = await Gym.find().populate("cuotas").populate("clases", "tipoClase");

        if (!gyms) {
            return next({
                success: false,
                message: "There isn't any gym"
            });
        }
        return res.status(200).json({
            sucess: true,
            gyms
        })

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})

//Users filter by a Fee, it's necesary give in params a Fee
gymRouter.get("/listarCuotas/:id", checkToken, async (req, res, next) => {
    try {
        const { id } = req.user;
        const cuotas = req.params.id;

        let gymCuotas = await Gym.findById(id);
        if (!gymCuotas) {
            return next({
                sucess: false,
                message: `There isn't any gym with the id: ${id}`
            })
        } else {
            //buscamos los usuarios que tienen esa cuota
            const usuariosCuota = await Users.find().select("nombre apellidos cuota");

            const usFiltrados = usuariosCuota.filter(user => {
                if (user.cuota.equals(cuotas)) {
                    return user
                }
            });

            return res.status(201).json({
                success: true,
                usFiltrados
            })
        }

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})

module.exports = gymRouter;
