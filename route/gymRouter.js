const express = require("express");
const Gym = require("../models/Gym"); //requerimos el export
const Users = require("../models/User");
const classRouter = require("./classRouter");
const gymRouter = express.Router();

//Creacion
gymRouter.post("/", async (req, res) => {

    try {
        const { nombreCentro, direccion, entrenadores, cuotas, clases } = req.body;

        //Los required, los controlamos
        if (!nombreCentro) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Te has dejado o el nombre!"
            })
        }
        const todosGym = await Gym.find();
        let existeNombre = false
        todosGym.forEach(gym => {
            if (gym.nombreCentro == nombreCentro) {
                existeNombre = true;
            }
        });
        if (existeNombre) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Ya existe un gimnasio con ese nombre!"
            })
        }

        let gym = new Gym({
            nombreCentro, direccion, entrenadores, cuotas, clases
        });

        const newGym = await gym.save();

        return res.status(201).json({
            success: true,
            gym: newGym
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            succes: false,
            message: err.message
        });
    };
});

//Encuentra todos y muestra todo (populate)
gymRouter.get("/", async (req, res) => {
    try {
        Gym.find().populate("cuotas").populate("clases", "nombre").exec((err, gyms) => {

            if (err) {
                res.status(400).send("no se ha encontrado ningun gimnasio!");
            }

            res.json(gyms);
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            succes: false,
            message: err.message
        })
    }
});

//Dado un gimnasio, ver todos los usuarios activos en su centro. 
gymRouter.get("/find/users/:id", async (req, res) => {
    try {
        const { id } = req.params  //La id del gimnasio


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

//Eliminar un gimnasio
gymRouter.delete("/delete/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const gymBorrado = await Gym.findByIdAndDelete(id);

        if (!gymBorrado) {
            return res.sendStatus(404).json({
                success: false,
                message: "No se ha encontrado el gimnasio que desea borrar"
            });
        }
        return res.send(`Se ha borrado de la BBDD el gym con id ${id}`);
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
});

//Encuentra un gimnasio por id
gymRouter.get("/find/:id", async (req, res) => {
    try {
        const { id } = req.params
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

//Actualizacion de los datos del gimnasio
gymRouter.put("/:id/update", async (req, res) => {
    try {
        const { id } = req.params  //La id del gimnasio

        const { nombreCentro, direccion, entrenadores, cuotas, clases } = req.body;

        let gym = await Gym.findById(id);

        if (nombreCentro) {
            gym.nombreCentro = nombreCentro;
        }
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
//Usuarios listados por cuota, es necesario indicar por params una cuota
gymRouter.get("/:id/listarCuotas", async (req, res) => {

    const { id } = req.params;
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
                if (user.cuota.equals(cuotas[0]) && user.gimnasio.equals(id)) {
                    console.log(user.gimnasio);
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
})
module.exports = gymRouter;
