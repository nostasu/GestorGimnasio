const express = require("express");
const Gym = require("../models/Gym"); //requerimos el export
const Users = require("../models/User");
const Class = require("../models/Class");
const { checkToken } = require("../middleware");
const gymRouter = express.Router();

async function comprobarAutentificacion(idGym) {
    let gym = await Gym.findById(idGym);
    if (!gym) {
        return res.status(404).json({
            sucess: false,
            message: "No existe ningun gimnasio con esta id"
        })
    } else {
        return gym;
    }
}

gymRouter
    .route("/")
    //Muestra el nombre de todos los usuarios del gimnasio logueado, no es necesario login
    .get(checkToken, async (req, res) => {
        try {
            const { id } = req.user; //La id del gym que esta conectado

            await comprobarAutentificacion(id);

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

            const { direccion, entrenadores, cuotas } = req.body;

            let gym = await comprobarAutentificacion(id);
            console.log(gym);

            if (direccion) {
                gym.direccion = direccion;
            }
            if (entrenadores) {
                gym.entrenadores = entrenadores;
            }
            if (cuotas) {
                gym.cuotas = cuotas;
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

            let gymBorrado = await comprobarAutentificacion(id);

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

//Que el gimnasio, una vez login, pueda ver todos los usuarios activos en su centro. 
gymRouter.get("/find/users/", checkToken, async (req, res) => {
    try {
        const { id } = req.user;  //La id del gimnasio


        let users = await Users.find().populate("gimnasio", "nombreCentro");
        //Todos usuarios cambian su id gym por el nombre
        const gyms = await Gym.findById(id);  //Nos encuentra el gym con el id pasado

        let usuariosGymnasio = [];
        users.forEach(user => {
            if (user.gimnasio.nombreCentro == gyms.nombreCentro) {
                usuariosGymnasio.push(user);
            }
        });

        return res.json({
            sucess: true,
            usuariosGymnasio
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})

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
        let gyms = await Gym.find().populate("cuotas").populate("clases", "nombre");

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
