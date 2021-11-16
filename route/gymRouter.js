const express = require("express");
const Gym = require("../models/Gym"); //requerimos el export
const Users = require("../models/User");
const Class = require("../models/Class");
const { checkToken } = require("../middleware");
const gymRouter = express.Router();

gymRouter
    .route("/")
    //Muestra el nombre de todos los usuarios del gimnasio login
    .get(checkToken, async (req, res) => {
        try {
            const { id } = req.user; //La id del gym que esta conectado

            let gym = await Gym.findById(id);
            if (!gym) {
                return res.status(404).json({
                    sucess: false,
                    message: "No existe ningun gimnasio con esta id"
                })
            }

            //existe el gimnasio, mostramos sus usuarios
            const usuariosGym = await Users.find().populate("gimnasio", "nombreCentro");

            const usFiltrados = usuariosGym.filter(user => {
                if (user.gimnasio.equals(id)) {
                    return user;
                }
            });

            if (usFiltrados.length == 0) {
                return res.status(404).json({
                    sucess: false,
                    message: "No hay ningun usuario asociado a este gym"
                })
            }

            return res.json({
                success: true,
                usFiltrados
            })

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })
    //Actualizacion de los datos del gimnasio
    .put(checkToken, async (req, res) => {
        try {
            const { id } = req.user  //La id del gimnasio

            const { direccion, entrenadores } = req.body;

            let gym = await Gym.findById(id);
            if (!gym) {
                return res.status(404).json({
                    sucess: false,
                    message: "No existe ningun gimnasio con esta id"
                })
            }

            if (direccion) {
                gym.direccion = direccion;
            }
            if (entrenadores) {
                gym.entrenadores = entrenadores;
            }

            const gymUpdate = await gym.save();
            return res.json({
                sucess: true,
                gymUpdate
            })

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })

    //Eliminar un gimnasio
    .delete(checkToken, async (req, res) => {
        try {
            const { id } = req.user;

            let gymBorrado = await Gym.findById(id);
            if (!gymBorrado) {
                return res.status(404).json({
                    sucess: false,
                    message: "No existe ningun gimnasio con esta id"
                })
            }

            //Borrar en Clases las clases en las que se impartian en ese gym
            gymBorrado.clases.forEach(async claseBorrar => {
                let clase = await Class.findByIdAndDelete(claseBorrar._id);
                console.log(`Clase borrada: ${clase}`);
            })

            //Borrar el campo reservas (ya que todas van a ser de ese Gym), cuota y gym al usuario que estuviera en ese gimnasio
            let usuarios = await Users.find({ gimnasio: id });
            usuarios.forEach(async user => {
                user.gimnasio = null;
                user.cuota = null;
                user.reservas = [];
                await user.save();
            });

            //Borrar en Fees todas sus cuotas
            gymBorrado.cuotas.forEach(async cuotaGym => {
                await Fees.findByIdAndDelete(cuotaGym);
            })
            await Gym.findByIdAndDelete(id);

            return res.json({
                sucess: true,
                message: `Se ha borrado de la BBDD el gimnasio con id ${id}`
            });

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    });


//Encuentra un gimnasio por id //no es necesario estar login
gymRouter.get("/find/", async (req, res) => {
    try {
        const { id } = req.body
        const gym = await Gym.findById(id);
        if (!gym) {
            return res.status(404).json({
                sucess: false,
                message: "No existe ningun gimnasio con esta id"
            })
        }
        return res.json({
            success: true,
            gym
        })
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})

//Mostrar todos gym con todos datos (populate);
//Encuentra todos y muestra todo (populate)
gymRouter.get("/allGyms", async (req, res) => {
    try {
        let gyms = await Gym.find().populate("cuotas").populate("clases", "tipoClase");

        if (!gyms) {
            return res.status(403).json({
                success: false,
                message: "Todavia no hay ningun gym en nuestra BBDD"
            });
        }
        return res.json({
            sucess: true,
            gyms
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})

//Usuarios listados por cuota, es necesario indicar por params una cuota
gymRouter.get("/listarCuotas", checkToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { cuotas } = req.body;

        let gymCuotas = await Gym.findById(id);
        if (!gymCuotas) {
            return res.status(404).json({
                sucess: false,
                message: "No existe ningun gimnasio con esta id"
            })
        } else {
            if (cuotas) {
                //buscamos los usuarios que tienen esa cuota
                const usuariosCuota = await Users.find();

                const usFiltrados = usuariosCuota.filter(user => {
                    if (user.cuota.equals(cuotas) && user.gimnasio.equals(id)) {
                        return user
                    }
                });

                return res.json({

                    success: true,
                    usFiltrados

                })
            } else {
                return res.status(404).json({
                    sucess: false,
                    message: "El gimnasio que ha indicado no tiene esa cuota"
                })
            }
        }
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})

module.exports = gymRouter;
